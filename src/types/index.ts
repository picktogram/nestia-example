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

  interface DetailArticle {
    id: number;
    contents: string;
    images: {
      id: number;
      position: number;
      url: string;
      depth: number;
    }[];
    writer: {
      id: number;
      nickname: string;
      profileImage: string;
    };
    comments: {
      id: number;
      parentId: number;
      contents: string;
      xPosition: number;
      yPosition: number;
    }[];
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace CommentType {
  interface RootComment {
    id: number;
    writerId: number;
    parentId: number;
    contents: string;
    xPosition: number;
    yPosition: number;
  }
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
