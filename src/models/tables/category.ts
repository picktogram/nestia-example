import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Product } from './product';

@Entity()
export class Category extends TimeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
