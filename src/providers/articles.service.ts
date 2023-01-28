import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
  ) {}
}
