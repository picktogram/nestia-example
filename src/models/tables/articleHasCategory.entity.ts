import { Entity, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';

@Entity({ name: 'airtcle_has_categories' })
export class ArticleHasCategoryEntity extends CreatedAtColumn {
  @PrimaryColumn()
  public readonly categoryId!: number;

  @PrimaryColumn()
  public readonly airtcleId!: number;
}
