import { Entity, Column, ManyToMany } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends CommonCloumns {
  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.categories)
  articles: ArticleEntity[];
}
