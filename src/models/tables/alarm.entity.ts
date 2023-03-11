import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { UserEntity } from './user.entity';

@Entity({ name: 'alarm' })
export class AlarmEntity extends CommonCloumns {
  @Column()
  public userId!: number;

  @Column()
  public resourceName?: string;

  @Column()
  public resourceId?: number;

  @Column()
  public redirectLink?: number;

  /**
   * below are relations.
   */

  @ManyToOne(() => UserEntity, (u) => u.alarms)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;
}
