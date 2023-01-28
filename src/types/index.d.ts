import { User } from '@root/models/tables/user';

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

type DecodedUserToken = Pick<
  User,
  'id' | 'name' | 'nickname' | 'phoneNumber' | 'email' | 'birth' | 'gender'
>;
