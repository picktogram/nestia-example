import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Article } from './article';

@Index('FK__HeaderImage__Article', ['articleId'], {})
@Entity()
export class HeaderImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false, select: false })
  articleId: number;

  @Column('varchar', { nullable: false })
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  position: number;

  /**
   * below are relaitons
   */

  @ManyToOne(() => Article, (article) => article.headers)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;
}
