import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_like_comment' })
export class UserLikeCommentEntity extends CreatedAtColumn {
  /**
   * 유저의 아이디
   * @type int
   */
  @PrimaryColumn('int4')
  public readonly userId!: number;

  /**
   * 유저가 좋아요를 클릭한 댓글의 아이디
   * @type int
   */
  @PrimaryColumn('int4')
  public readonly commentId!: number;

  /**
   * below are relations
   */

  @ManyToOne(() => UserEntity, (u) => u.userLikesComements)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => CommentEntity, (c) => c.commentLikedByUsers)
  @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
  comment!: CommentEntity;
}
