import { Entity, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';

@Entity({ name: 'airtcle_has_categories' })
export class ArticleHasCategoryEntity extends CreatedAtColumn {
  /**
   * 카테고리의 아이디
   * @type int
   */
  @PrimaryColumn()
  public readonly categoryId!: number;

  /**
   * 게시글의 아이디
   * @type int
   */
  @PrimaryColumn()
  public readonly airtcleId!: number;
}
