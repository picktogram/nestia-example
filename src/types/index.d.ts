type Push<T extends any[], U> = [...T, U];
type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

type ListType = {
  data: any[];
  count: number;
};

type ListOutputValue = {
  totalPage: number;
  totalResult: number;
  list: any[];
};

type ExtendedResponse<T> = {
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
  type FollowStatus = 'follow' | 'followUp' | 'reverse' | 'nothing';
}
