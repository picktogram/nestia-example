import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Product } from './product';

@Entity()
export class Seller extends TimeColumns {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Column('varchar', { unique: true, select: false })
  public address!: string;

  @Column('varchar', { select: false })
  public password!: string;

  @Column('varchar')
  public name!: string;

  @Column('varchar', { nullable: true, select: false })
  public nickname!: string;

  @Column('varchar', { nullable: true, select: false })
  public profileImage!: string;

  @Column('varchar', { nullable: true, unique: true, select: false })
  public phoneNumber!: string;

  @Column('varchar', { nullable: true, unique: true, select: false })
  public email!: string;

  @Column('varchar', { comment: '사업장 명' })
  public shopName!: string;

  @Column('int', { default: 0, comment: '기본 배송비' })
  public basicFee!: number;

  @Column('int', { default: 0, comment: '도서 산간 지방 배송비' })
  public exceptionFee: number;

  @Column('int', { default: 0, comment: '배송비 무료 기준 금액' })
  public baseFee: number;

  @Column('varchar', { select: false, comment: '사업장 명' })
  public companyName!: string;

  @Column('varchar', { select: false, comment: '영업용 메일' })
  public companyEmail!: string;

  @Column('varchar', { select: false, comment: '영업용 번호' })
  public companyPhonNumber!: string;

  @Column('varchar', { select: false, comment: '사업자번호' })
  public businessNumber!: string;

  @OneToMany(() => Product, (product) => product.seller)
  @JoinColumn({ name: 'sellerId', referencedColumnName: 'id' })
  products: Product[];
}
