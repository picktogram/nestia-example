import { Entity, Column, ManyToOne, JoinColumn, AfterLoad } from 'typeorm';
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

  /**
   * properties
   */

  public logicalId?: `${string}-${number}`;

  /**
   * methods
   */

  @AfterLoad()
  setLogicalId() {
    if (this.resourceName && this.resourceId) {
      this.logicalId = `${this.resourceName}-${this.resourceId}`;
    }
  }
}
