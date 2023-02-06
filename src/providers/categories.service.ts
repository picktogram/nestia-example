import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/tables/category.entity';
import { Repository } from 'typeorm';
import { ArticleHasCategoryEntity } from '@root/models/tables/articleHasCategory.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(ArticleHasCategoryEntity)
    private readonly productHasCategoriesRepository: Repository<ArticleHasCategoryEntity>,
  ) {}

  async getAll(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find();
  }
}
