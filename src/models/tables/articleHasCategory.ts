import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'airtcle_has_categories' })
export class ArticleHasCategory {
  @PrimaryColumn()
  public readonly categoryId!: number;

  @PrimaryColumn()
  public readonly airtcleId!: number;
}
