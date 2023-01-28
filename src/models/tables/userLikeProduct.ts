import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'user_like_product' })
export class UserLikeProduct {
  @PrimaryColumn()
  public readonly userId!: number;

  @PrimaryColumn()
  public readonly productId!: number;

  @CreateDateColumn()
  public readonly createdAt: Date;
}
