import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_bridge' })
export class UserBridgeEntity extends CreatedAtColumn {
  @ApiProperty()
  @PrimaryColumn()
  firstUserId: number;

  @ApiProperty()
  @PrimaryColumn()
  secondUserId: number;

  @ApiProperty({ enum: ['follow', 'followUp'] })
  @Column({ default: 'follow' })
  status: 'follow' | 'followUp';

  /**
   * below are relations
   */

  @ManyToOne(() => UserEntity, (u) => u.firstUserBridges)
  @JoinColumn({ name: 'firstUserId', referencedColumnName: 'id' })
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.secondUserBridges)
  @JoinColumn({ name: 'secondUserId', referencedColumnName: 'id' })
  secondUser: UserEntity;
}
