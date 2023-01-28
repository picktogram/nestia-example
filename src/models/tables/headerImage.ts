import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product';

@Index('FK__HeaderImage__Product', ['productId'], {})
@Entity()
export class HeaderImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false, select: false })
  productId: number;

  @Column('varchar', { nullable: false })
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  position: number;

  @ManyToOne(() => Product, (product) => product.headers)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;
}
