import { CreateDateColumn, BaseEntity } from 'typeorm';
import typia from 'typia';

export abstract class CreatedAtColumn extends BaseEntity {
  @CreateDateColumn()
  public readonly createdAt!: typia.Primitive<Date> | Date | string;
}
