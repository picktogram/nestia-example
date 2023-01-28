import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsRepository } from '@root/models/repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async getDetail(productId: number) {
    const product = await this.productsRepository.getProduct(productId);
    if (!product) {
      throw new Error('there is not product!');
    }
    return product;
  }
}
