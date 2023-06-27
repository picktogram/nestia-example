import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';
import { CommonCloumns } from '../common/common-columns';
import { UserLikeCommentEntity } from './user-like-comment.entity';
import { BodyImageEntity } from './body-image.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends CommonCloumns {
  /**
   * 댓글이 달린 게시글의 아이디
   * @type int
   */
  @Column('int4', { select: false })
  articleId!: number;

  /**
   * 작성자의 아이디
   * @type int
   */
  @Column('int4', { select: false })
  writerId!: number;

  /**
   * '부모 댓글이 있는 경우, 즉 답글인 경우에는 부모 댓글 아이디를 받는다.'
   * @type int
   */
  @Column('int4', { nullable: true })
  parentId?: number | null;

  /**
   * 게시글 내용
   * @minLength 1
   * @maxLength 1000
   */
  @Column('text')
  contents!: string;

  /**
   * 이미지의 아이디로 없을 수도 있다.
   * 없는 경우에는 그 게시글에 달린 것으로, xPosition, yPosition을 무시한다.
   */
  @Column('int4', { nullable: true })
  imageId?: number | null;

  /**
   * 소수점을 포함한 좌표 값
   */
  @Column({ type: 'numeric', nullable: true })
  xPosition?: number | `${number}` | null;

  /**
   * 소수점을 포함한 좌표 값
   */
  @Column({ type: 'numeric', nullable: true })
  yPosition?: number | `${number}` | null;

  /**
   * below are relations
   */

  @ManyToOne(() => ArticleEntity, (a) => a.comments)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article!: ArticleEntity;

  @ManyToOne(() => UserEntity, (u) => u.comments)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer!: UserEntity;

  @ManyToOne(() => CommentEntity, (parent) => parent.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent!: CommentEntity;

  @OneToMany(() => CommentEntity, (children) => children.parent)
  children!: CommentEntity[];

  @OneToMany(() => UserLikeCommentEntity, (ulc) => ulc.comment)
  commentLikedByUsers?: UserLikeCommentEntity[];

  @ManyToOne(() => BodyImageEntity, (image) => image.comments)
  @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
  image!: BodyImageEntity;
}
