import { Entity, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';

@Entity({ name: 'user_like_article' })
export class UserLikeArticleEntity extends CreatedAtColumn {
  /**
   * 유저의 아이디
   */
  @PrimaryColumn()
  public readonly userId!: number;

  /**
   * 유저가 좋아요를 클릭한 게시글의 아이디
   */
  @PrimaryColumn()
  public readonly articleId!: number;
}
