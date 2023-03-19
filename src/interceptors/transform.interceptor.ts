import { Try } from '../types';

/**
 * TODO : 여기 있는 타입들을 모두 types/index.ts로 옮기고, 가능한 하나의 인터페이스로 통합할 것
 */

export interface InitialPaginationResponseType {
  list: any[];
  count: number;
}

export interface PaginationResponseType<T extends InitialPaginationResponseType> {
  list: T['list'];
  count: T['count'];
  totalResult: number;
  totalPage: number;
  search?: string;
  page: number;
}

export interface PaginationForm<T extends InitialPaginationResponseType> {
  result: true;
  code: 1000;
  requestToResponse?: `${number}ms`;
  data: PaginationResponseType<T>;
}

export const calcListTotalCount = (totalCount = 0, limit = 0): { totalResult: number; totalPage: number } => {
  const totalResult = totalCount;
  const totalPage = totalResult % limit === 0 ? totalResult / limit : Math.floor(totalResult / limit) + 1;
  return { totalResult, totalPage };
};

export function createPaginationForm<ResponseType extends InitialPaginationResponseType>(
  responseData: ResponseType,
  paginationInfo: { limit: number; page: number; search?: string },
  requestToResponse?: `${number}ms`,
): PaginationForm<ResponseType> {
  const { limit, page, search } = paginationInfo;
  const { totalPage, totalResult } = calcListTotalCount(responseData.count, limit);
  return {
    result: true,
    code: 1000,
    requestToResponse,
    data: {
      list: responseData.list,
      count: responseData.count,
      page,
      totalResult,
      totalPage,
      search,
    },
  };
}

export function createResponseForm<T>(data: T, requestToResponse?: `${number}ms`): Try<T> {
  return {
    result: true,
    code: 1000,
    requestToResponse,
    data,
  } as const;
}
