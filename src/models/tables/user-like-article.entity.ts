import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

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

  /**
   * below are relations
   */

  @ManyToOne(() => UserEntity, (u) => u.userLikesArticles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => ArticleEntity, (a) => a.articleLikedByUsers)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article!: ArticleEntity;
}
