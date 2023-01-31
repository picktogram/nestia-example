import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../models/tables/category';
import { Repository } from 'typeorm';
import { ArticleHasCategory } from '@root/models/tables/articleHasCategory';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(ArticleHasCategory)
    private readonly productHasCategoriesRepository: Repository<ArticleHasCategory>,
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }
}
