import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../models/tables/category';
import { Product } from '../models/tables/product';
import { Repository } from 'typeorm';
import { ProductHasCategory } from '@root/models/tables/productHasCategory';
import { getOffset } from '@root/utils/getOffset';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(ProductHasCategory)
    private readonly productHasCategoriesRepository: Repository<ProductHasCategory>,
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async getProductsBy(
    categoryId: number,
    page: number,
  ): Promise<{ count: number; products: Product[] }> {
    const [count, relations] = await Promise.all([
      this.productHasCategoriesRepository.count({ where: { categoryId } }),
      this.productHasCategoriesRepository.find({
        relations: { product: true },
        where: { categoryId },
        ...getOffset(page),
      }),
    ]);

    return { count, products: relations.map((el) => el.product) };
  }
}
