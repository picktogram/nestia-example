import { Entity, Column, ManyToOne, JoinColumn, AfterLoad } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { UserEntity } from './user.entity';

@Entity({ name: 'alarm' })
export class AlarmEntity extends CommonCloumns {
  /**
   * 유저의 아이디
   * @type int
   */
  @Column()
  public userId!: number;

  @Column()
  public resourceName?: string;

  /**
   * 알람이 가리키는 리소스의 아이디로, 리소스마다 동일한 숫자의 아이디를 가질 수 있기에 유니크한 값이 아니다.
   * @type int
   */
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
