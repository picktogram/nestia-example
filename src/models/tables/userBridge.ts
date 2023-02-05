import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { User } from './user';

@Entity()
export class UserBridge extends CreatedAtColumn {
  @PrimaryColumn()
  firstUserId: number;

  @PrimaryColumn()
  secondUserId: number;

  /**
   * below are relations
   */

  @ManyToOne(() => User, (u) => u.firstUserBridges)
  @JoinColumn({ name: 'firstUserId', referencedColumnName: 'id' })
  firstUser: User;

  @ManyToOne(() => User, (u) => u.secondUserBridges)
  @JoinColumn({ name: 'secondUserId', referencedColumnName: 'id' })
  secondUser: User;
}
