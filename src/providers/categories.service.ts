import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/tables/category.entity';
import { ILike, Repository } from 'typeorm';
import { ArticleHasCategoryEntity } from '../models/tables/articleHasCategory.entity';
import { SearchPaginationDto } from '../models/dtos/search-pagination.dto';
import { getOffset } from '../utils/getOffset';
import { CategoryType } from '../types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(ArticleHasCategoryEntity)
    private readonly productHasCategoriesRepository: Repository<ArticleHasCategoryEntity>,
  ) {}

  async getAll({ page, limit, search }: SearchPaginationDto): Promise<{ list: CategoryType.Element[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });
    const keywords: string[] = search?.trim().split(/\s+/g) || [];
    const [list, count] = await this.categoriesRepository.findAndCount({
      where: keywords.map((keyword) => ({ name: ILike(`%${keyword}%`) })),
      skip,
      take,
    });
    return { list, count };
  }
}
