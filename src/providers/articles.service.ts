import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from '../config/constant/error';
import { CreateArticleDto } from '../models/dtos/create-article.dto';
import { PaginationDto } from '../models/dtos/pagination.dto';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import { GetAllArticlesResponseDto } from '../models/response/get-all-articles-response.dto';
import { ArticleEntity } from '../models/tables/article.entity';
import { CommentEntity } from '../models/tables/comment.entity';
import { UserBridgeEntity } from '../models/tables/userBridge.entity';
import { ArticleType, UserBridgeType } from '../types';
import { getOffset } from '../utils/getOffset';
import { DataSource, In } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @InjectRepository(UserBridgesRepository) private readonly userBridgesRepository: UserBridgesRepository,

    private readonly dataSource: DataSource,
  ) {}

  async getOneDetailArticle(userId: number, articleId: number): Promise<ArticleType.DetailArticle> {
    const article = await this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id', 'a.contents'])
      .addSelect(['w.id', 'w.nickname', 'w.profileImage'])
      .addSelect(['i.id', 'i.position', 'i.url', 'i.depth'])
      .addSelect(['c.id', 'c.parentId', 'c.contents', 'c.xPosition', 'c.yPosition'])
      .leftJoin('a.images', 'i', 'i.parentId IS NULL')
      .leftJoin('a.comments', 'c')
      .innerJoin('a.writer', 'w')
      .where('a.id = :articleId', { articleId })
      .getOne();

    if (!article) {
      throw new BadRequestException(ERROR.CANNOT_FINDONE_ARTICLE);
    }

    return article;
  }

  async read(
    userId: number,
    { page, limit }: PaginationDto,
  ): Promise<{
    list: GetAllArticlesResponseDto[];
    count: number;
  }> {
    const { skip, take } = getOffset(page, limit);

    const query = this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id AS "id"', 'a.contents AS "contents"', 'a.createdAt AS "createdAt"'])
      .addSelect(['w.id AS "writerId"', 'w.nickname AS "nickname"', 'w.profileImage AS "profileImage"'])
      .leftJoin('a.writer', 'w')
      .orderBy('a.createdAt', 'DESC')
      .offset(skip)
      .limit(take);

    const [list, count]: [ArticleType.ReadArticleResponse[], number] = await Promise.all([
      query.getRawMany(),
      query.getCount(),
    ]);

    const [comments, userBridges] = await Promise.all([
      this.dataSource
        .createQueryBuilder()
        .from((qb) => {
          return qb
            .from(CommentEntity, 'c')
            .select(['c.id AS "id"', 'c.contents AS "contents"', 'c.articleId AS "articleId"'])
            .addSelect('ROW_NUMBER() OVER (PARTITION BY c."articleId" ORDER BY c."createdAt" DESC)::int4 AS "position"')
            .where('c.articleId IN (:...articleIds)', { articleIds: list.map((el) => el.id) });
        }, 'cte')
        .getRawMany(),
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
        return new GetAllArticlesResponseDto(userId, article, representationComments, followStatus);
      }),
      count,
    };
  }

  async write(userId: number, { contents, images }: CreateArticleDto): Promise<ArticleEntity> {
    const checkedImages = this.checkIsSamePosition(images);
    const writedArticle = await this.articlesRepository.save(
      ArticleEntity.create({
        writerId: userId,
        contents,
        images: checkedImages,
      }),
    );

    // TODO : 실제 이미지 저장에 사용되지 않은 이미지들을 삭제하는 기능을 여기에 추가할 것

    return writedArticle;
  }

  private checkIsSamePosition<T extends { position: number }>(images: T[]): T[] {
    const isSamePositionImage = images
      .map((el) => el.position)
      .filter((el) => el !== 0)
      .find((el, i, arr) => {
        const isSamePosition = (other: number, otherIdx: number) => {
          return el === other && i !== otherIdx;
        };
        return arr.some(isSamePosition);
      });

    if (isSamePositionImage) {
      throw new BadRequestException(ERROR.IS_SAME_POSITION);
    }

    return this.sortImageByIndex(images);
  }

  private sortImageByIndex<T extends { position: number }>(images: T[]): T[] {
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
}
