import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from '@root/config/constant/error';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { GetOneArticleResponseDto } from '@root/models/response/get-one-article-response.dto';
import { getOffset } from '@root/utils/getOffset';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async getOneDetailArticle(userId: number, articleId: number): Promise<GetOneArticleResponseDto> {
    const article = await this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id'])
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

    const articles = await this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id', 'a.contents', 'a.createdAt'])
      .addSelect(['w.id', 'w.nickname', 'w.profileImage'])
      .leftJoin('a.images', 'i')
      .leftJoin('a.writer', 'w')
      .orderBy('a.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();

    return articles;
  }

  async write(userId: number, { contents, images }: CreateArticleDto) {
    const checkedImages = this.checkIsSamePosition(images);
    await this.articlesRepository.save({
      writerId: userId,
      contents,
      images: checkedImages,
    });

    return true;
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
