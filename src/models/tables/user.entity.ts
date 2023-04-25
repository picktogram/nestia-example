import { Entity, Column, ManyToMany, JoinTable, OneToMany, AfterLoad } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';
import { AlarmEntity } from './alarm.entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { ReportArticleEntity } from './report-article.entity';
import { UserBridgeEntity } from './user-bridge.entity';
import { UserLikeArticleEntity } from './user-like-article.entity';
import { UserLikeCommentEntity } from './user-like-comment.entity';

export type DecodedUserToken = Pick<UserEntity, 'id' | 'name' | 'nickname' | 'email' | 'birth'>;

@Entity({ name: 'user' })
export class UserEntity extends CommonCloumns {
  /**
   * 이름 칼럼으로 사용자의 이름을 의미
   * @minLength 1
   * @maxLength 50
   */
  @Column('varchar', { length: 50, select: false })
  public name!: string;

  /**
   * 사용자의 별칭, 설정하지 않는 경우도 있다.
   * @minLength 1
   * @maxLength 50
   */
  @Column('varchar', { length: 50 })
  public nickname!: string;

  /**
   * 사용자의 커버 이미지
   */
  @Column('text', { nullable: true, select: false })
  public coverImage?: string | null;

  /**
   * 사용자의 프로필 이미지
   */
  @Column('text', { nullable: true, select: false })
  public profileImage?: string | null;

  /**
   * 사용자의 전화번호로 동일한 값은 없으며, 미입력된 계정 둘의 전화번호가 같을 경우 계정 통합을 요구할 예정
   * @minLength 11
   * @maxLength 13
   */
  @Column('text', { nullable: true, unique: true, select: false })
  public phoneNumber!: string;

  /**
   * 사용자의 이메일 주소로 로그인 시 필요
   * @format email
   * @minLength 4
   * @maxLength 50
   */
  @Column('varchar', { nullable: true, unique: true, select: false })
  public email!: string;

  /**
   * 사용자의 비밀번호로 로그인 시 필요
   */
  @Column('varchar', { select: false })
  public password!: string;

  /**
   * @maxLength 2000
   */
  @Column('text', { select: false, nullable: true })
  public introduce?: string | null;

  /**
   * 사용자의 생일을 의미하는 값
   */
  @Column('timestamp with time zone', { nullable: true, select: false })
  public birth?: string | null;

  /**
   * 사용자의 성별로 true면 남자라고 가정한다.
   */
  @Column('boolean', { nullable: true, select: false })
  public gender?: boolean | null;

  /**
   * 회원 가입 시 받는 값으로 수신 거부 가능
   */
  @Column('boolean', { select: false, default: false, comment: 'sms 광고 수신 동의' })
  public smsAdsConsent!: boolean;

  /**
   * 회원 가입 시 받는 값으로 수신 거부 가능
   */
  @Column('boolean', { select: false, default: false, comment: 'email 광고 수신 동의' })
  public emailAdsConsent!: boolean;

  /**
   * 유저의 탈퇴 여부를 의미한다.
   */
  @Column('bool', { select: false, default: false })
  public status!: boolean;

  /**
   * below are relations
   */

  @ManyToMany(() => ArticleEntity, (article) => article.users, { nullable: false })
  @JoinTable({
    name: 'user_like_article',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'articleId', referencedColumnName: 'id' },
  })
  userLikeArticles!: ArticleEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followees)
  @JoinTable({
    name: 'user_bridge',
    joinColumn: { name: 'firstUserId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'secondUserId', referencedColumnName: 'id' },
  })
  followers!: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  @JoinTable({
    name: 'user_bridge',
    joinColumn: { name: 'firstUserId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'secondUserId', referencedColumnName: 'id' },
  })
  followees!: UserEntity[];
  /**
   * 해당 유저로부터 팔로우를 건 대상들의 bridges
   */
  @OneToMany(() => UserBridgeEntity, (ub) => ub.firstUser)
  firstUserBridges!: UserBridgeEntity[];

  /**
   * 해당 유저에게 팔로우를 건 대상들의 bridges
   */
  @OneToMany(() => UserBridgeEntity, (ub) => ub.secondUser)
  secondUserBridges!: UserBridgeEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.writer)
  articles!: ArticleEntity[];

  @OneToMany(() => CommentEntity, (c) => c.writer)
  comments!: CommentEntity[];

  @OneToMany(() => AlarmEntity, (a) => a.user)
  alarms!: AlarmEntity[];

  @OneToMany(() => ReportArticleEntity, (ra) => ra.user)
  userReportArticle!: ReportArticleEntity[];

  @OneToMany(() => UserLikeArticleEntity, (ula) => ula.user)
  userLikesArticles?: UserLikeArticleEntity[];

  @OneToMany(() => UserLikeCommentEntity, (ulc) => ulc.user)
  userLikesComements?: UserLikeCommentEntity[];

  /**
   * methods
   */

  @AfterLoad()
  setNickname() {
    if (this.status === false) {
      this.nickname ??= this.name;
    } else if (this.status === true) {
      this.nickname = `이름없음`; // NOTE : 탈퇴한 유저의 이름을 숨기는 기능
    }
  }
}
