import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from '@root/config/constant/error';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { CommentsRepository } from '@root/models/repositories/comments.repository';
import { getAllArticlesResponseDto } from '@root/models/response/get-all-articles-response.dto';
import { GetOneArticleResponseDto } from '@root/models/response/get-one-article-response.dto';
import { Article } from '@root/models/tables/article';
import { Comment } from '@root/models/tables/comment';
import { getOffset } from '@root/utils/getOffset';
import { DataSource, In, IsNull } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,

    private readonly dataSource: DataSource,
  ) {}

  async getOneDetailArticle(userId: number, articleId: number): Promise<GetOneArticleResponseDto> {
    const article = await this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id', 'a.contents'])
      .addSelect(['w.id', 'w.nickname', 'w.profileImage'])
      .addSelect(['i.id', 'i.position', 'i.depth'])
      .leftJoin('a.images', 'i', 'i.parentId IS NULL')
      .innerJoin('a.writer', 'w')
      .where('a.id = :articleId', { articleId })
      .getOne();

    if (!article) {
      throw new BadRequestException(ERROR.CANNOT_FINDONE_ARTICLE);
    }

    return new GetOneArticleResponseDto(article);
  }

  async read(userId: number, { page, limit }: PaginationDto) {
    const { skip, take } = getOffset(page, limit);

    const query = this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id AS "id"', 'a.contents AS "contents"', 'a.createdAt AS "createdAt"'])
      .addSelect(['w.id AS "writerId"', 'w.nickname AS "nickname"', 'w.profileImage AS "profileImage"'])
      .leftJoin('a.writer', 'w')
      .orderBy('a.createdAt', 'DESC')
      .offset(skip)
      .limit(take);

    const [list, count]: [
      {
        id: number;
        contents: string;
        createdAt: Date;
        writerId: number;
        nickname: string;
        profileImage: string;
      }[],
      number,
    ] = await Promise.all([query.getRawMany(), query.getCount()]);

    const comments = await this.dataSource
      .createQueryBuilder()
      .from((qb) => {
        return qb
          .from(Comment, 'c')
          .select(['c.id AS "id"', 'c.contents AS "contents"', 'c.articleId AS "articleId"'])
          .addSelect('ROW_NUMBER() OVER (PARTITION BY c."articleId" ORDER BY c."createdAt" DESC)::int4 AS "position"')
          .where('c.articleId IN (:...articleIds)', { articleIds: list.map((el) => el.id) });
      }, 'cte')
      .getRawMany();

    return {
      list: list.map((article) => {
        const representationComments = comments.filter((el) => el.articleId === article.id);
        return new getAllArticlesResponseDto(userId, article, representationComments);
      }),
      count,
    };
  }

  async write(userId: number, { contents, images }: CreateArticleDto) {
    const checkedImages = this.checkIsSamePosition(images);
    const writedArticle = await this.articlesRepository.save({
      writerId: userId,
      contents,
      images: checkedImages,
    });

    // TODO : 실제 이미지 저장에 사용되지 않은 이미지들을 삭제하는 기능을 여기에 추가할 것

    return writedArticle;
  }

  private checkIsSamePosition(images: { position: number }[]) {
    const isSamePositionImage = images
      .map((el) => el.position)
      .find((el, i, arr) => {
        const isSamePosition = (other: number, otherIdx: number) => el === other && i !== otherIdx;
        return arr.filter((el) => el !== 0).some(isSamePosition);
      });

    if (isSamePositionImage) {
      throw new BadRequestException(ERROR.IS_SAME_POSITION);
    }

    return this.sortImageByIndex(images);
  }

  private sortImageByIndex(images: { position: number }[]) {
    return images.map((image, i) => {
      image.position = image.position || i;
      return image;
    });
  }
}
