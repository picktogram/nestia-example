import { UserBridgeType } from '../../types';
import { Exclude, Expose } from 'class-transformer';

export class GetAllArticlesResponseDto {
  @Expose()
  private readonly id!: number;
  @Expose()
  private readonly contents!: string;
  @Expose()
  private readonly createdAt!: Date;
  @Expose()
  private readonly isMine!: boolean;

  @Exclude()
  private readonly writerId!: number;
  @Exclude()
  private readonly nickname!: string;
  @Exclude()
  private readonly profileImage!: string;

  @Exclude()
  private readonly commentMetadata!: { id: number; contents: string }[];
  @Exclude()
  private readonly followStatus!: UserBridgeType.FollowStatus;

  @Expose()
  get writer() {
    return {
      id: this.writerId,
      nickname: this.nickname,
      profileImage: this.profileImage,
      followStatus: this.followStatus,
    };
  }

  @Expose()
  get comments() {
    return this.commentMetadata;
  }

  constructor(
    readerId: number,
    metadata: {
      id: number;
      contents: string;
      createdAt: Date;
      writerId: number;
      nickname: string;
      profileImage: string;
    },
    commentMetadata: { id: number; contents: string }[] = [],
    followStatus: UserBridgeType.FollowStatus,
  ) {
    Object.assign(this, metadata);

    this.commentMetadata = commentMetadata;
    this.followStatus = followStatus;
    this.isMine = readerId === this.writerId;
  }
}
