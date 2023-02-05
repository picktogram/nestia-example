import { Entity, Column, ManyToMany } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { Article } from './article';

@Entity()
export class Category extends CommonCloumns {
  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
