import { UserEntity } from '@root/models/tables/user.entity';

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

export type DecodedUserToken = Pick<UserEntity, 'id' | 'name' | 'nickname' | 'email' | 'birth' | 'gender'>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ArticleType {
  export type ReadArticleResponse = {
    id: number;
    contents: string;
    createdAt: Date;
    writerId: number;
    nickname: string;
    profileImage: string;
  };
}
