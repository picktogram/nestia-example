import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from '@root/decorators/is-optional-number.decorator';
import { IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Article } from './article';

@Entity()
export class BodyImage extends TimeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  articleId: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ default: 1 })
  depth: number;

  @Column({ length: 2048 })
  @ApiProperty({ description: '서버를 통해 한 번 전처리된 이미지.' })
  // @IsNotEmptyString(4, 2048)
  @IsUrl()
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  @ApiProperty({ description: '이미지의 정렬 순서로, 오름차순 정렬된다.' })
  @IsOptionalNumber()
  position: number;

  /**
   * below are relations
   */

  @ManyToOne(() => Article, (article) => article.images)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: Article;

  @ManyToOne(() => BodyImage, (parent) => parent.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent: BodyImage;

  @OneToMany(() => BodyImage, (child) => child.parent)
  children: BodyImage[];
}
