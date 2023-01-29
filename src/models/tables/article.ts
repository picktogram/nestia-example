import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '@root/decorators/is-not-empty-string.decorator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { TimeColumns } from '../common/time-columns';
import { BodyImage } from './bodyImage';
import { Category } from './category';
import { User } from './user';

@Entity()
export class Article extends TimeColumns {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public writerId: number;

  @ApiProperty({ description: '글의 내용물로, 최대 3,000자' })
  @Column('text')
  @IsNotEmptyString(1, 3000)
  public contents: string;

  @Column({ default: 0, select: false })
  isReported: number;

  /**
   * below are relations
   */
  @ManyToOne(() => User, (writer) => writer.articles)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: User;

  @OneToMany(() => BodyImage, (image) => image.article)
  bodies: BodyImage[];

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable({
    name: 'article_has_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => User, (user) => user.userLikeArticles)
  users: User[];
}
