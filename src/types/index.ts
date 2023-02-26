import { ArticleEntity } from '../models/tables/article.entity';
import { BodyImageEntity } from '../models/tables/bodyImage.entity';
import { CommentEntity } from '../models/tables/comment.entity';
import { UserEntity } from '../models/tables/user.entity';

export type Push<T extends any[], U> = [...T, U];
export type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

export type ListType = {
  data: any[];
  count: number;
};

export type ListOutputValue = {
  totalPage: number;
  totalResult: number;
  list: any[];
};

export type ExtendedResponse<T> = {
  result: boolean;
  code: number;
  // data: T;
  data: T extends ListType ? ListOutputValue : T;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
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
    writer: Pick<UserEntity, 'id' | 'nickname' | 'profileImage'>;
    // comments: Pick<CommentEntity, 'id' | 'parentId' | 'contents' | 'xPosition' | 'yPosition'>[];
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace CommentType {
  interface RootComment extends Pick<CommentEntity, 'id' | 'writerId' | 'contents' | 'xPosition' | 'yPosition'> {}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
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
