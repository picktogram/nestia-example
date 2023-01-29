import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async write(userId: number, createArticleDto: CreateArticleDto) {
    const article = await this.articlesRepository.save({
      userId,
      ...createArticleDto,
    });

    return article;
  }
}
