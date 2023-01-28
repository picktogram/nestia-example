import { Entity, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';

@Entity({ name: 'user_like_article' })
export class UserLikeArticle extends CreatedAtColumn {
  @PrimaryColumn()
  public readonly userId!: number;

  @PrimaryColumn()
  public readonly articleId!: number;
}
