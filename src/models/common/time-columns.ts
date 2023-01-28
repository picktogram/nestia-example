import { UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { CreatedAtColumn } from './created-at.column';

export abstract class TimeColumns extends CreatedAtColumn {
  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;
}
