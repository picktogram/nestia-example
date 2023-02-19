import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../decorators/is-not-empty-string.decorator';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { BodyImageEntity } from './bodyImage.entity';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'article' })
export class ArticleEntity extends CommonCloumns {
  @Column()
  public writerId!: number;

  @ApiProperty({ description: '글의 내용물로, 최대 3,000자', minLength: 1, maxLength: 3000 })
  @Column('text')
  @IsNotEmptyString(1, 3000)
  public contents!: string;

  @Column({ default: 0, select: false })
  isReported!: number;

  /**
   * below are relations
   */
  @ManyToOne(() => UserEntity, (writer) => writer.articles)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer!: UserEntity;

  @OneToMany(() => BodyImageEntity, (image) => image.article, {
    cascade: ['insert'],
  })
  images!: BodyImageEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.articles)
  @JoinTable({
    name: 'article_has_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories!: CategoryEntity[];

  @ManyToMany(() => UserEntity, (user) => user.userLikeArticles)
  users!: UserEntity[];

  @OneToMany(() => CommentEntity, (c) => c.article)
  comments!: CommentEntity[];

  /**
   * method( subscriber ) area
   */

  /**
   * static values
   */

  static TOO_MANY_REPORTED: 10 = 10 as const;
  static REPRESENTATION_COMMENT_MAXIUM_COUNT: 3 = 3 as const;
}
