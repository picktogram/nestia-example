import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';
import { IsOptionalNumber } from '@root/decorators/is-optional-number.decorator';
import { CommonCloumns } from '../common/common-columns';

@Entity({ name: 'comment' })
export class CommentEntity extends CommonCloumns {
  @Column({ select: false })
  articleId: number;

  @Column({ select: false })
  writerId: number;

  @IsOptionalNumber()
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty()
  @IsNotEmptyString(0, 1000)
  @Column('text')
  contents: string;

  @ManyToOne(() => ArticleEntity, (a) => a.comments)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (u) => u.comments)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: UserEntity;
}
