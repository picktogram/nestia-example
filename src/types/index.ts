/* eslint-disable @typescript-eslint/no-namespace */

import { PaginationForm } from '../interceptors/transform.interceptor';
import { GetAllArticlesResponseDto } from '../models/response/get-all-articles-response.dto';
import { AlarmEntity } from '../models/tables/alarm.entity';
import type { ArticleEntity } from '../models/tables/article.entity';
import type { BodyImageEntity } from '../models/tables/bodyImage.entity';
import type { CommentEntity } from '../models/tables/comment.entity';
import type { UserEntity } from '../models/tables/user.entity';

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

  interface getAcquaintanceResponse extends PaginationForm<{ list: Profile[]; count: number }> {}

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

export declare namespace ArticleType {
  interface ReadArticleResponse {
    id: number;
    contents: string;
    createdAt: Date;
    writerId: number;
    nickname: string;
    profileImage: string;
  }

  interface DetailArticle extends Pick<ArticleEntity, 'id' | 'contents'> {
    images?: Pick<BodyImageEntity, 'id' | 'position' | 'url' | 'depth'>[];
    writer: UserType.Profile;
    comments: Pick<CommentEntity, 'id' | 'parentId' | 'contents' | 'xPosition' | 'yPosition'>[];
  }

  interface GetAllArticlesReponse
    extends PaginationForm<{
      list: GetAllArticlesResponseDto[];
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
}

export declare namespace UserBridgeType {
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
