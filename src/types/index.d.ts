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
declare namespace ArticleType {
  interface ReadArticleResponse {
    id: number;
    contents: string;
    createdAt: Date;
    writerId: number;
    nickname: string;
    profileImage: string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace UserBridgeType {
  export type FollowStatus = 'follow' | 'followUp' | 'reverse' | 'nothing';
}

export interface TestDto {
  /**
   * @format email
   * @minLength 10
   * @maxLength 60
   */

  email: string;
}
