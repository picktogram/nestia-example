/* eslint-disable @typescript-eslint/no-namespace */

import type { ERROR } from '../config/legacy/error';
import type { PaginationForm } from '../common/interceptors/transform.interceptor';
import type { CreateArticleDto } from '../models/dtos/create-article.dto';
import type { AlarmEntity } from '../models/tables/alarm.entity';
import type { ArticleEntity } from '../models/tables/article.entity';
import type { BodyImageEntity } from '../models/tables/body-image.entity';
import type { CategoryEntity } from '../models/tables/category.entity';
import type { CommentEntity } from '../models/tables/comment.entity';
import type { ReportArticleEntity } from '../models/tables/report-article.entity';
import type { DecodedUserToken, UserEntity } from '../models/tables/user.entity';

export type Merge<F, S> = {
  [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

export interface ResponseForm<T> {
  result: true;
  code: 1000;
  requestToResponse?: `${number}ms`;
  data: T;
}

export type KeyOfError = keyof typeof ERROR;
export type ValueOfError = (typeof ERROR)[KeyOfError];

export type ERROR = { result: false; code: number; data: string };
export interface InitialPaginationResponseType {
  list: any[];
  count: number;
}
export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;
export type TryPagination<T extends InitialPaginationResponseType> = PaginationForm<T>;
export type TryCatchPagination<T extends InitialPaginationResponseType, E extends ValueOfError> = PaginationForm<T> | E;

export interface NestiaTypeErrorObject {
  path: string;
  reason: string;
  expected: string;
  value: any;
  message: string;
}

export type Push<T extends any[], U> = [...T, U];
export type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

export interface ListType {
  data: any[];
  count: number;
}

export interface ListOutputValue {
  totalPage: number;
  totalResult: number;
  list: any[];
}

export interface ExtendedResponse<T> {
  result: boolean;
  code: number;
  // data: T;
  data: T extends ListType ? ListOutputValue : T;
}

export declare namespace AlarmType {
  interface Element extends Pick<AlarmEntity, 'id' | 'userId' | 'resourceName' | 'resourceId' | 'redirectLink'> {}

  interface ReadResponseType extends PaginationForm<{ list: Element[]; count: number }> {}
}

export declare namespace UserType {
  interface Profile extends Pick<UserEntity, 'id' | 'nickname' | 'profileImage'> {}
  interface DetailProfile
    extends Merge<DecodedUserToken, Pick<UserEntity, 'profileImage' | 'coverImage' | 'introduce'>> {
    /**
     * 나 자신의 프로필인 경우에는 true, 아닌 경우에는 false로 나온다.
     */
    myself?: boolean;
  }
  interface DetailProfileWithRelation extends UserType.DetailProfile {
    followStatus: UserBridgeType.FollowStatus;
  }

  interface UpdateUserDto extends Partial<Pick<UserEntity, 'nickname' | 'profileImage' | 'coverImage' | 'introduce'>> {}

  interface Acquaintance extends Merge<UserType.Profile, { reason: '나를 팔로우한 사람' }> {}
  interface GetAcquaintanceResponse extends PaginationForm<{ list: Acquaintance[]; count: number }> {}
  interface UserProfilePagination extends PaginationForm<{ list: UserType.Profile[]; count: number }> {}

  interface ProfileList {
    list: UserType.Profile[];
    count: number;
  }

  interface Retuation extends Pick<UserEntity, 'id'> {
    /**
     * 지금까지 질문을 한 횟수로, 게시글과 무관하게 질문 횟수는 한 번 더 카운트해준다.
     */
    question: number;

    /**
     * 답변을 한 횟수
     */
    answer: number;

    /**
     * 최상위로 채택된 답변의 수로, 시간이 지남에 따라 변동될 수 있다
     */
    adopted: number;

    /**
     * 글을 작성한 수
     */
    writing: number;

    /**
     * 좋아요를 받은 수로, 게시글과 댓글 모두를 합한 것을 의미한다.
     */
    likes: number;
  }
}

export declare namespace CategoryType {
  interface Element extends Pick<CategoryEntity, 'id' | 'name'> {}

  /**
   * 카테고리 수가 많아지기 전까지는 굳이 페이지네이션이 없어도 된다고 판단하였음.
   */
  interface FindAllResponse extends PaginationForm<{ list: Element[]; count: number }> {}
}

export declare namespace ArticleType {
  interface ReportReason extends Pick<ReportArticleEntity, 'reason'> {}

  interface ReadArticleResponse {
    id: number;
    contents: string;
    createdAt: Date;
    writerId: number;
    nickname: string;
    profileImage: string;
  }

  interface UpdateArticleDto extends Omit<Partial<CreateArticleDto>, 'images'> {}

  interface DetailArticle extends Pick<ArticleEntity, 'id' | 'contents'> {
    images?: Pick<BodyImageEntity, 'id' | 'position' | 'url' | 'depth'>[];
    writer: UserType.Profile;
    comments: Pick<CommentEntity, 'id' | 'parentId' | 'contents' | 'xPosition' | 'yPosition'>[];
  }

  interface GetAllArtcleDto extends PaginationDto {
    /**
     * @type int
     */
    writerId?: number;
  }

  interface Element
    extends Merge<
      Omit<ArticleType.ReadArticleResponse, 'writerId' | 'nickname' | 'profileImage'>,
      {
        isMine: boolean;
        writer: any;
        comments: any[];
      }
    > {}

  interface GetAllArticlesReponse
    extends PaginationForm<{
      list: ArticleType.Element[];
      count: number;
    }> {}
}

export declare namespace CommentType {
  interface RootComment extends Pick<CommentEntity, 'id' | 'writerId' | 'contents' | 'xPosition' | 'yPosition'> {}

  interface CreateResponse
    extends Pick<
      CommentEntity,
      | 'id'
      | 'articleId'
      | 'writerId'
      | 'contents'
      | 'xPosition'
      | 'yPosition'
      // | 'deletedAt'
      // | 'createdAt'
      // | 'updatedAt'
      | 'parentId'
    > {}

  interface ReadCommentsResponse extends PaginationForm<{ list: RootComment[]; count: number }> {}
}

export declare namespace UserBridgeType {
  /**
   * follow : 팔로우
   * followUp : 맞 팔로우
   * reverse : 팔로우 당한 상태
   * nothing : 아무런 관계도 없는 디자이너
   */
  export type FollowStatus = 'follow' | 'followUp' | 'reverse' | 'nothing';
}

export interface TestDto {
  /**
   * @format email
   * @minLength 10
   * @maxLength 100
   */

  email: string;
}

export interface PaginationDto {
  /**
   * 페이지네이션의 페이지 값
   * @minimum 1
   */
  page: number;

  /**
   * @maximum 100
   */
  limit: number;
}
