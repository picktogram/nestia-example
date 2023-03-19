import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CreatedAtColumn } from '../common/created-at.column';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'report_article' })
export class ReportArticleEntity extends CreatedAtColumn {
  /**
   * 유저의 아이디
   * @type int
   */
  @PrimaryGeneratedColumn()
  public userId!: number;

  /**
   * 게시글의 아이디
   * @type int
   */
  @PrimaryGeneratedColumn()
  public articleId!: number;

  /**
   * 신고를 철회했을 경우를 대비하여 canceled라는 상태를 둔다.
   */
  @Column({ default: 'reported' })
  public status!: 'reported' | 'canceled';

  /**
   * 신고를 하는 이유가 무엇인지를 기재하는 칸으로, 최소 10글자 이상
   *
   * @length 10
   */
  @Column('text')
  public reason?: string;

  /**
   * below are relations
   */

  @ManyToOne(() => UserEntity, (u) => u.userReportArticle)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => ArticleEntity, (a) => a.articleReportedByUser)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article!: ArticleEntity;
}
