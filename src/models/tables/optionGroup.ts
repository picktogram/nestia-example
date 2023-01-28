import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { Option } from './option';
import { Product } from './product';

@Index('FK__OptionGroup__Product', ['productId'], {})
@Entity()
export class OptionGroup extends TimeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false, select: false })
  public productId!: number;

  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: false,
    comment: '선택 옵션 유무',
  })
  public isOptional!: boolean;

  @Column('varchar', { nullable: false, comment: '옵션 그룹 이름' })
  public title!: string;

  @ManyToOne(() => Product, (product) => product.optionGroups)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;

  @OneToMany(() => Option, (option) => option.group)
  options: Option[];
}
