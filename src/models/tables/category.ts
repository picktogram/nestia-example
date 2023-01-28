import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Article } from './article';

@Entity()
export class Category extends TimeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
