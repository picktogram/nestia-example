import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { BodyImageEntity } from './bodyImage.entity';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { ReportArticleEntity } from './report-article.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'article' })
export class ArticleEntity extends CommonCloumns {
  /**
   * 게시글을 작성한 유저의 아이디
   */
  @Column()
  public writerId!: number;

  /**
   * 글의 내용물로, 최대 3,000자
   *
   * @minLength 1
   * @maxLength 3000
   */
  @Column('text')
  public contents!: string;

  /**
   * 게시글 작성 시 디자이너님은 아래 4가지 중 하나를 반드시 골라야 한다.
   * question은 질문하기 유형의 게시글,
   * draw는 그림 그리기로, 그림 위 댓글을 달 수 있는 유형의 피그마 식 게시글,
   * event는 모임이나 행사 등, 약속을 공유할 수 있도록 달력 기능을 제공하는 게시글,
   * writing은 그 외 어떠한 글이든 포함되는 타입을 말한다.
   */
  @Column({ default: 'writing' })
  public type!: 'question' | 'draw' | 'event' | 'writing';

  /**
   * 신고당한 횟수를 의미한다.
   */
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

  @OneToMany(() => ReportArticleEntity, (ra) => ra.article)
  articleReportedByUser!: ReportArticleEntity[];

  /**
   * method( subscriber ) area
   */

  /**
   * static values
   */

  static TOO_MANY_REPORTED: 10 = 10 as const;
  static REPRESENTATION_COMMENT_MAXIUM_COUNT: 3 = 3 as const;
}
