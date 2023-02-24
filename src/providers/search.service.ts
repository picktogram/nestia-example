import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,
  ) {}

  async searchArticles(contents: string) {
    return this.articlesRepository
      .createQueryBuilder('a')
      .select(['a.id', 'a.contents'])
      .where('a.contents ILIKE :contents', { contents: `%${contents}%` })
      .getMany();
  }

  async searchComments(contents: string) {
    return this.commentsRepository
      .createQueryBuilder('c')
      .select(['c.id', 'c.contents'])
      .where('c.contents ILIKE :contents', { contents: `%${contents}%` })
      .getMany();
  }
}
