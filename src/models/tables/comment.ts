import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article';
import { TimeColumns } from '../common/time-columns';
import { User } from './user';

@Entity()
export class Comment extends TimeColumns {
  @ApiProperty({ description: 'id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  articleId: number;

  @Column({ select: false })
  writerId: number;

  @Column('text')
  contents: string;

  @ManyToOne(() => Article, (a) => a.comments)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;

  @ManyToOne(() => User, (u) => u.comments)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: User;
}
