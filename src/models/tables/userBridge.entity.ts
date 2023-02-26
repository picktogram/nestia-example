import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_bridge' })
export class UserBridgeEntity extends CreatedAtColumn {
  /**
   * 유저의 아이디
   */
  @PrimaryColumn()
  firstUserId!: number;

  /**
   * 유저의 아이디
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
