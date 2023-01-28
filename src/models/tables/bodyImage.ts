import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article';

@Entity()
export class BodyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false, select: false })
  articleId: number;

  @Column('varchar', { nullable: false })
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  position: number;

  @ManyToOne(() => Article, (article) => article.bodies)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;
}
