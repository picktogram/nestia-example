import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';
import { IsOptionalNumber } from '@root/decorators/is-optional-number.decorator';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'body_image' })
export class BodyImageEntity extends CommonCloumns {
  @Column({ select: false })
  articleId: number;

  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({ description: '처음 이미지를 1이라 할 때, 몇 번째 업데이트 이미지인가?', example: 1 })
  @Column({ default: 1 })
  depth: number;

  @ApiProperty({ description: '서버를 통해 한 번 전처리된 이미지.', example: 'https://folder/test.jpg' })
  @Column({ length: 2048 })
  @IsNotEmptyString(4, 2048)
  url: string;

  @Column('decimal', { name: 'position', precision: 6, scale: 5, default: 0 })
  @ApiProperty({ description: '이미지의 정렬 순서로, 오름차순 정렬된다.' })
  @IsOptionalNumber()
  position: number;

  /**
   * below are relations
   */

  @ManyToOne(() => ArticleEntity, (article) => article.images)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: ArticleEntity;

  @ManyToOne(() => BodyImageEntity, (parent) => parent.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent: BodyImageEntity;

  @OneToMany(() => BodyImageEntity, (child) => child.parent)
  children: BodyImageEntity[];
}
