import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product';

@Entity({ name: 'product_has_categories' })
export class ProductHasCategory {
  @PrimaryColumn()
  public readonly categoryId!: number;

  @PrimaryColumn()
  public readonly productId!: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
