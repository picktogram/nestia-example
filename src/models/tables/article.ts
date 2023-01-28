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
import { HeaderImage } from './headerImage';
import { User } from './user';

@Entity()
export class Article extends TimeColumns {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public writerId: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public guide: string;

  @Column()
  public originalPrice: number;

  @Column()
  public salesPrice: number;

  @Column()
  public releaseCount: number;

  /**
   * below are relations
   */

  @ManyToOne(() => User, (writer) => writer.articles)
  @JoinColumn({ name: 'writerId', referencedColumnName: 'id' })
  writer: User;

  @OneToMany(() => HeaderImage, (image) => image.article)
  headers: HeaderImage[];

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
