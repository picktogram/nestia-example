import { UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import typia from 'typia';
import { CreatedAtColumn } from './created-at.column';

export abstract class TimeColumns extends CreatedAtColumn {
  @UpdateDateColumn()
  public readonly updatedAt!: typia.Primitive<Date> | Date | string;

  @DeleteDateColumn()
  public readonly deletedAt?: typia.Primitive<Date> | Date | string;
}
