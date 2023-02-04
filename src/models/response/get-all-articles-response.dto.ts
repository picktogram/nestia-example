import { Exclude, Expose } from 'class-transformer';

export class getAllArticlesResponseDto {
  @Expose()
  private readonly id: number;
  @Expose()
  private readonly contents: string;
  @Expose()
  private readonly createdAt: Date;
  @Expose()
  private readonly isMine: boolean;

  @Exclude()
  private readonly writerId: number;
  @Exclude()
  private readonly nickname: string;
  @Exclude()
  private readonly profileImage: string;

  get writer() {
    return {
      id: this.writerId,
      nickname: this.nickname,
      profileImage: this.profileImage,
    };
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
  ) {
    Object.assign(this, metadata);
    this.isMine = readerId === this.writerId;
  }
}
