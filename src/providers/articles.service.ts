import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { getOffset } from '@root/utils/getOffset';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async read(userId: number, { page, limit }: PaginationDto) {
    const { skip, take } = getOffset(page, limit);

    const articles = await this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id', 'a.contents'])
      .addSelect(['w.id', 'w.nickname', 'w.profileImage'])
      .leftJoin('a.images', 'i')
      .leftJoin('a.writer', 'w')
      .orderBy('a.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();

    return articles;
  }

  async write(userId: number, createArticleDto: CreateArticleDto) {
    try {
      await this.articlesRepository.save({
        writerId: userId,
        ...createArticleDto,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
