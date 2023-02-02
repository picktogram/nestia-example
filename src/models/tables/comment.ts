import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article';
import { TimeColumns } from '../common/time-columns';
import { User } from './user';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';

@Entity()
export class Comment extends TimeColumns {
  @ApiProperty({ description: 'id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  articleId: number;

  @Column({ select: false })
  writerId: number;

  @ApiProperty()
  @IsNotEmptyString(0, 1000)
  @Column('text')
  contents: string;

  @ManyToOne(() => Article, (a) => a.comments)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;

  @ManyToOne(() => User, (u) => u.comments)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: User;
}
