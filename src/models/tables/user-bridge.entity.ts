import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_bridge' })
export class UserBridgeEntity extends CreatedAtColumn {
  /**
   * 유저의 아이디(from)로, 팔로우를 건 사람을 의미한다.
   * 맞팔의 경우 서로가 서로에 대해 [from, to], [to, from]으로 존재한다.
   * @type int
   */
  @PrimaryColumn()
  firstUserId!: number;

  /**
   * 유저의 아이디(to)로, 팔로우를 당한 사람을 의미한다.
   * 맞팔의 경우 서로가 서로에 대해 [from, to], [to, from]으로 존재한다.
   * @type int
   */
  @PrimaryColumn()
  secondUserId!: number;

  /**
   * below are relations
   */

  @ManyToOne(() => UserEntity, (u) => u.firstUserBridges)
  @JoinColumn({ name: 'firstUserId', referencedColumnName: 'id' })
  firstUser!: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.secondUserBridges)
  @JoinColumn({ name: 'secondUserId', referencedColumnName: 'id' })
  secondUser!: UserEntity;
}
