import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { BodyImage } from './bodyImage';
import { Category } from './category';
import { Comment } from './comment';
import { User } from './user';

@Entity()
export class Article extends CommonCloumns {
  @Column()
  public writerId: number;

  @ApiProperty({ description: '글의 내용물로, 최대 3,000자', minLength: 1, maxLength: 3000 })
  @Column('text')
  @IsNotEmptyString(1, 3000)
  public contents: string;

  @Column({ default: 0, select: false })
  isReported: number;

  /**
   * below are relations
   */
  @ManyToOne(() => User, (writer) => writer.articles)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: User;

  @OneToMany(() => BodyImage, (image) => image.article, {
    cascade: ['insert'],
  })
  images: BodyImage[];

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable({
    name: 'article_has_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => User, (user) => user.userLikeArticles)
  users: User[];

  @OneToMany(() => Comment, (c) => c.article)
  comments: Comment[];

  /**
   * method( subscriber ) area
   */

  /**
   * static values
   */

  static TOO_MANY_REPORTED: 10 = 10 as const;
  static REPRESENTATION_COMMENT_MAXIUM_COUNT: 3 = 3 as const;
}
