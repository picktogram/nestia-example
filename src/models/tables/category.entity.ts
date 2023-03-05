import { Entity, Column, ManyToMany } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends CommonCloumns {
  /**
   * 카테고리의 이름으로, 디자인 계열의 카테고리 이름
   */
  @Column('varchar', { nullable: false, unique: true })
  name!: string;

  /**
   * below are relations
   */

  @ManyToMany(() => ArticleEntity, (article) => article.categories)
  articles!: ArticleEntity[];
}
