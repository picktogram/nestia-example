import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { OptionGroup } from './optionGroup';

@Index('FK__Option__OptionGroup', ['groupId'], {})
@Entity()
export class Option extends TimeColumns {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('int', { nullable: false, select: false })
  public groupId!: number;

  @Column('varchar', { nullable: false, comment: '옵션 이름' })
  public title!: string;

  @Column('tinyint', { width: 1, nullable: false, default: false })
  public isSale!: boolean;

  @ManyToOne(() => OptionGroup, (group) => group.options)
  @JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
  group: OptionGroup;
}
