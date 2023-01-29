import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Article } from './article';

@Entity()
export class BodyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  articleId: number;

  @Column()
  parentId: number;

  @Column()
  depth: number;

  @Column({ length: 2048 })
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  position: number;

  /**
   * below are relations
   */

  @ManyToOne(() => Article, (article) => article.bodies)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;

  @ManyToOne(() => BodyImage, (parent) => parent.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent: BodyImage;

  @OneToMany(() => BodyImage, (child) => child.parent)
  children: BodyImage[];
}
