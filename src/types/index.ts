import { User } from '@root/models/tables/user';

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

export type DecodedUserToken = Pick<
  User,
  'id' | 'name' | 'nickname' | 'email' | 'birth' | 'gender'
>;
