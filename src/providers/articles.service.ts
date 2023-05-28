import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from '../models/dtos/create-article.dto';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import { ArticleEntity } from '../models/tables/article.entity';
import { UserBridgeEntity } from '../models/tables/user-bridge.entity';
import { ArticleType, UserBridgeType } from '../types';
import { getOffset } from '../utils/getOffset';
import { DataSource, In } from 'typeorm';
import { CommentEntity } from '../models/tables/comment.entity';
import { ReportArticlesRepository } from '../models/repositories/report-articles.repository';
import { UserLikeArticlesRepository } from '../models/repositories/user-like-articles.repository';
import typia from 'typia';
import { ARLEADY_REPORTED_ARTICLE, IS_SAME_POSITION } from '../config/errors/business-error';
import { isBusinessErrorGuard } from '../config/errors';
import { BodyImageEntity } from '../models/tables/body-image.entity';
import { UserLikeArticleEntity } from '../models/tables/user-like-article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(UserBridgesRepository)
    private readonly userBridgesRepository: UserBridgesRepository,
    @InjectRepository(ReportArticlesRepository)
    private readonly reportArticlesRepository: ReportArticlesRepository,
    @InjectRepository(UserLikeArticlesRepository)
    private readonly userLikeArticlesRepository: UserLikeArticlesRepository,

    private readonly dataSource: DataSource,
  ) {}

  async likeOrUnLike(userId: number, articleId: number): Promise<boolean> {
    const like = await this.userLikeArticlesRepository.findOneBy({
      userId,
      articleId,
    });

    if (like) {
      await this.userLikeArticlesRepository.remove(like);
    } else {
      await this.userLikeArticlesRepository.save({ userId, articleId });
    }

    return !like;
  }

  async modify(articleId: number, updateArticleDto: ArticleType.UpdateArticleDto) {
    await this.articlesRepository.update({ id: articleId }, updateArticleDto);
  }

  async report(userId: number, articleId: number, reason?: string): Promise<true | ARLEADY_REPORTED_ARTICLE> {
    const report = await this.reportArticlesRepository.findOneBy({ userId, articleId });
    if (!report) {
      await this.reportArticlesRepository.save({ userId, articleId, reason });
      return true;
    }

    if (report.status === 'canceled') {
      await this.reportArticlesRepository.update({ userId, articleId }, { status: 'reported' });
      return true;
    }

    return typia.random<ARLEADY_REPORTED_ARTICLE>();
  }

  async getOneDetailArticle(userId: number, articleId: number): Promise<ArticleType.DetailArticle | null> {
    const [article, comments] = await Promise.all([
      this.articlesRepository
        .createQueryBuilder('a')
        .select(['a.id', 'a.contents'])
        .addSelect(['i.id', 'i.position', 'i.url', 'i.depth'])
        .addSelect(['w.id', 'w.nickname', 'w.profileImage'])
        .leftJoin('a.images', 'i', 'i.parentId IS NULL')
        .innerJoin('a.writer', 'w')
        .where('a.id = :articleId', { articleId })
        .getOne(),
      this.commentsRepository.find({
        select: { id: true, parentId: true, contents: true, xPosition: true, yPosition: true },
        where: { articleId },
        order: { createdAt: 'DESC' },
        take: 10,
      }),
    ]);

    if (!article) {
      return null;
    }

    article.comments = comments;
    return article;
  }

  async read(
    userId: number,
    { page, limit, writerId, searchKeyword }: ArticleType.GetAllArtcleDto,
    { isNoReply }: { isNoReply?: boolean },
  ): Promise<{
    list: ArticleType.Element[];
    count: number;
  }> {
    const { skip, take } = getOffset({ page, limit });

    let query = this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id AS "id"', 'a.contents AS "contents"', 'a.createdAt AS "createdAt"'])
      .addSelect(['w.id AS "writerId"', 'w.nickname AS "nickname"', 'w.profileImage AS "profileImage"'])
      .addSelect((qb) => {
        return qb
          .select('b.url')
          .from(BodyImageEntity, 'b')
          .where('b.articleId = a.id')
          .orderBy('b.position', 'ASC')
          .limit(1);
      }, 'thumbnail')
      .addSelect((qb) => {
        return qb
          .select('(CASE WHEN COUNT(*) = 0 THEN FALSE ELSE TRUE END)::bool')
          .from(UserLikeArticleEntity, 'ula')
          .where('ula.articleId = a.id')
          .andWhere('ula.userId = :userId', { userId })
          .limit(1);
      }, 'myPick')
      .leftJoin('a.writer', 'w')
      .where('1=1')
      .orderBy('a.createdAt', 'DESC')
      .offset(skip)
      .limit(take);

    if (isNoReply === true) {
      query = query
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('COUNT(*)')
            .from(CommentEntity, 'c')
            .where('c.articleId = a.id')
            .getQuery();

          return `${subQuery} = 0`;
        })
        .andWhere('a.type = :type', { type: 'question' });
    }

    if (writerId) {
      query = query.andWhere('a.writerId = :writerId', { writerId });
    }

    if (searchKeyword) {
      const keywords = searchKeyword.split(/\s+/g).filter(Boolean);
      keywords.forEach((keyword, i) => {
        query.andWhere(`a.contents ILIKE :keyword${i}`, { [`keyword${i}`]: `%${keyword}%` });
      });
    }

    const [list, count]: [ArticleType.ReadArticleResponse[], number] = await Promise.all([
      query.getRawMany(),
      query.getCount(),
    ]);

    const [comments, userBridges] = await Promise.all([
      this.getRepresentCommentsByArticeIds(list.map((el) => el.id)),
      this.userBridgesRepository.find({
        where: [
          {
            firstUserId: userId,
            secondUserId: In(list.map((el) => el.writerId)),
          },
          {
            firstUserId: In(list.map((el) => el.writerId)),
            secondUserId: userId,
          },
        ],
      }),
    ]);

    return {
      list: list.map((article) => {
        const representationComments = comments.filter((el) => el.articleId === article.id);
        const follow = userBridges.find((el) => el.firstUserId === userId && el.secondUserId === article.writerId);
        const followed = userBridges.find((el) => el.firstUserId === userId && el.secondUserId === article.writerId);
        const followStatus: 'follow' | 'followUp' | 'reverse' | 'nothing' = this.getFollowStatus(follow, followed);
        // return new GetAllArticlesResponseDto(userId, article, representationComments, followStatus);
        return {
          id: article.id,
          contents: article.contents,
          createdAt: article.createdAt,
          thumbnail: article.thumbnail,
          isMine: userId === article.writerId,
          myPick: article.myPick,
          writer: {
            id: article.writerId,
            nickname: article.nickname,
            profileImage: article.profileImage,
            followStatus,
          },
          comments: representationComments,
        };
      }),
      count,
    };
  }

  async write(userId: number, { contents, images, type }: CreateArticleDto): Promise<ArticleEntity | IS_SAME_POSITION> {
    const checkedImages = this.checkIsSamePosition(images);
    if (isBusinessErrorGuard(checkedImages)) {
      return checkedImages;
    }

    const writedArticle = await this.articlesRepository.save(
      ArticleEntity.create({
        writerId: userId,
        contents,
        images: checkedImages,
        type,
      }),
    );

    // TODO : 실제 이미지 저장에 사용되지 않은 이미지들을 삭제하는 기능을 여기에 추가할 것

    return writedArticle;
  }

  private checkIsSamePosition<T extends { position?: number | `${number}` | null }>(
    images?: T[],
  ): T[] | IS_SAME_POSITION {
    if (!images || images.length === 0) {
      return [];
    }

    const isSamePositionImage = images
      .map((el, i, arr) => {
        const previousPosition = (i - 1 >= 0 ? arr.at(i - 1)?.position : 0) || 0;
        const nextPosition = (i + 1 === arr.length ? arr.at(i)?.position : arr.at(i + 1)?.position) || 0;
        const averagePosition = (Number(previousPosition) + Number(nextPosition)) / 2;

        return Number(el.position) || averagePosition;
      })
      .filter((el) => el !== 0)
      .find((el, i, arr) => {
        const isSamePosition = (other: number, otherIdx: number) => {
          return el === other && i !== otherIdx;
        };
        return arr.some(isSamePosition);
      });

    if (isSamePositionImage) {
      return typia.random<IS_SAME_POSITION>();
    }

    return this.sortImageByIndex(images);
  }

  private sortImageByIndex<T extends { position?: number | `${number}` | null }>(images: T[]): T[] {
    return images.map((image, i) => {
      image.position = image.position || i;
      return image;
    });
  }

  private getFollowStatus(follow?: UserBridgeEntity, followed?: UserBridgeEntity): UserBridgeType.FollowStatus {
    if (follow && followed) {
      return 'followUp';
    } else if (follow) {
      return 'follow';
    } else if (followed) {
      return 'reverse';
    } else {
      return 'nothing';
    }
  }

  private async getRepresentCommentsByArticeIds(articleIds: number[]) {
    if (articleIds.length === 0) {
      return [];
    }

    const comments = await this.dataSource
      .createQueryBuilder()
      .from((qb) => {
        return qb
          .from(CommentEntity, 'c')
          .select(['c.id AS "id"', 'c.contents AS "contents"', 'c.articleId AS "articleId"'])
          .addSelect('ROW_NUMBER() OVER (PARTITION BY c."articleId" ORDER BY c."createdAt" DESC)::int4 AS "position"')
          .where('c.articleId IN (:...articleIds)', { articleIds });
      }, 'cte')
      .getRawMany();

    return comments;
  }
}
