import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'body_image' })
export class BodyImageEntity extends CommonCloumns {
  /**
   * 이미지가 부착된 게시글의 아이디를 의미
   * @type int
   */
  @Column('int4', { select: false })
  articleId!: number;

  /**
   * 만약 어떤 댓글에 달려 있는 답글인 경우, 부모 댓글의 아이디를 가진다.
   * @type int
   */
  @Column('int4', { nullable: true })
  parentId?: number | null;

  /**
   * 처음 이미지를 1이라 할 때, 몇 번째 업데이트 이미지인지를 의미하는 값
   */
  @Column('int4', { default: 1 })
  depth!: number;

  /**
   * 서버를 통해 한 번 전처리된 이미지
   * example is @link {https://folder/test.jpg}
   *
   * @minLength 4
   * @maxLength 2048
   */
  @Column('varchar', { length: 2048 })
  url!: string;

  /**
   * 이미지의 정렬 순서로, 오름차순 정렬된다.
   */
  @Column('numeric', { name: 'position', default: 0 })
  position?: number | `${number}` | null;

  /**
   * below are relations
   */

  @ManyToOne(() => ArticleEntity, (article) => article.images)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article!: ArticleEntity;

  @ManyToOne(() => BodyImageEntity, (parent) => parent.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent!: BodyImageEntity;

  @OneToMany(() => BodyImageEntity, (child) => child.parent)
  children!: BodyImageEntity[];
}
