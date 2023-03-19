import { UserBridgeType } from '../../types';
import { Exclude, Expose } from 'class-transformer';

export class GetAllArticlesResponseDto {
  @Expose()
  public readonly id!: number;
  @Expose()
  public readonly contents!: string;
  @Expose()
  public readonly createdAt!: Date;
  @Expose()
  public readonly isMine!: boolean;

  @Exclude()
  public readonly writerId!: number;
  @Exclude()
  public readonly nickname!: string;
  @Exclude()
  public readonly profileImage?: string | null;

  @Exclude()
  public readonly commentMetadata!: { id: number; contents: string }[];
  @Exclude()
  public readonly followStatus!: UserBridgeType.FollowStatus;

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
