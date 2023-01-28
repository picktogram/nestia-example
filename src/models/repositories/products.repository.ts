import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../tables/product';

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {
  async getProduct(productId: number) {
    return await this.createQueryBuilder('product')
      .withDeleted()
      .leftJoinAndMapMany('prouct.headers', 'product.headers', 'header')
      .leftJoinAndMapMany('product.bodies', 'product.bodies', 'body')
      .leftJoinAndMapMany(
        'product.categories',
        'product.categories',
        'category',
        'category.deletedAt IS NULL',
      )
      .leftJoinAndMapMany(
        'product.options',
        'product.options',
        'option',
        'option.deletedAt IS NULL AND option.isSale = :isSale',
        { isSale: true },
      )
      .where('product.id = :productId', { productId })
      .andWhere('product.isSale = :isSale', { isSale: true })
      .getOne();
  }
}
