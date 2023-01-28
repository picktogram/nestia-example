import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';
import { IsOptionalBoolean } from '@root/decorators/is-optional-boolean.decorator';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Product } from './product';

@Entity()
export class User extends TimeColumns {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ApiProperty({ description: '이름 칼럼으로 사용자의 이름을 의미' })
  @IsNotEmptyString(1, 50)
  @Column('varchar', { length: 50, nullable: false, select: false })
  public name!: string;

  @ApiProperty({ description: '사용자의 별칭, 설정하지 않는 경우도 있다.' })
  @IsNotEmptyString(1, 50)
  @Column('varchar', { length: 50 })
  public nickname!: string;

  @ApiProperty({ description: '사용자의 프로필 이미지' })
  @Column('varchar', { nullable: true, select: false })
  public profileImage!: string;

  @ApiProperty({ description: '사용자의 전화번호로 동일한 값은 없다.' })
  @IsNotEmptyString(1, 50)
  @Column('varchar', { nullable: true, unique: true, select: false })
  public phoneNumber!: string;

  @ApiProperty({ description: '사용자의 이메일 주소로 로그인 시 필요' })
  @IsEmail()
  @IsNotEmptyString(1, 50)
  @Column('varchar', { nullable: true, unique: true, select: false })
  public email!: string;

  @ApiProperty({ description: '사용자의 비밀번호로 로그인 시 필요' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: '생일 이벤트 및 고객 분석을 위해 수집' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column('datetime', { nullable: true, select: false })
  public birth!: Date;

  @ApiProperty({ description: '사용자의 성별로 true면 남자라고 가정한다.' })
  @IsOptionalBoolean()
  @Column({ nullable: true, width: 1, select: false })
  public gender!: boolean;

  // @ApiProperty({ description: '사용자가 현재 가지고 있는 마일리지' })
  // @Column('int', {
  //   nullable: false,
  //   select: false,
  //   comment: '마일리지 잔여금',
  //   default: 0,
  // })
  // public mileage!: number;

  @ApiProperty({ description: '회원 가입 시 받는 값으로 수신 거부 가능' })
  @IsOptionalBoolean()
  @Column({
    width: 1,
    nullable: false,
    select: false,
    default: false,
    comment: 'sms 광고 수신 동의',
  })
  public smsAdsConsent!: boolean;

  @ApiProperty({ description: '회원 가입 시 받는 값으로 수신 거부 가능' })
  @IsOptionalBoolean()
  @Column({
    width: 1,
    nullable: false,
    select: false,
    default: false,
    comment: 'email 광고 수신 동의',
  })
  public emailAdsConsent!: boolean;

  @ManyToMany(() => Product, (product) => product.users, { nullable: false })
  @JoinTable({ name: 'user_like_product' })
  products: Product[];
}
