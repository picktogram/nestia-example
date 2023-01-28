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
