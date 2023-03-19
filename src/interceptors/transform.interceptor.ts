import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Req } from '@nestjs/common';
import { NON_PAGINATION } from '../config/constant';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExtendedResponse, ListOutputValue } from '../types';
import { ValueOfError } from '../config/constant/error';

export const calcListTotalCount = (totalCount = 0, limit = 0): { totalResult: number; totalPage: number } => {
  const totalResult = totalCount;
  const totalPage = totalResult % limit === 0 ? totalResult / limit : Math.floor(totalResult / limit) + 1;
  return { totalResult, totalPage };
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ExtendedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ExtendedResponse<T>> {
    const request: Request & { now: number } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((value) => {
        const requestToResponse = `${Date.now() - request.now}ms`;

        if (value instanceof Object && 'count' in value && 'list' in value) {
          const { list, count, ...restData } = value;

          const limit = request.query['limit'] ? request.query['limit'] : NON_PAGINATION;
          const page = request.query['page'];
          const search = request.query['search'];

          return {
            result: true,
            code: 1000,
            requestToResponse,
            data: {
              ...restData,
              list,
              ...(limit === NON_PAGINATION
                ? { totalResult: count, totalPage: 1 }
                : calcListTotalCount(count, Number(limit))),
              ...(search ? { search } : { search: null }),
              ...(page && { page: Number(page) }),
            } as ListOutputValue,
          };
        }

        return { result: true, code: 1000, requestToResponse, data: value };
      }),
    );
  }
}

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

export interface ResponseForm<T> {
  result: true;
  code: 1000;
  requestToResponse?: `${number}ms`;
  data: T;
}

export function createResponseForm<T>(data: T, requestToResponse?: `${number}ms`): ResponseForm<T> {
  return {
    result: true,
    code: 1000,
    requestToResponse,
    data,
  } as const;
}

export type Try<T, E extends ValueOfError> = ResponseForm<T> | E;
// export type Try<T, E extends ValueOfError> = ResponseForm<T> | E;
// export type Try<T, E extends ValueOfError | null> = E extends ValueOfError ? ResponseForm<T> | E : ResponseForm<T>;
// export type Try<T, E extends ValueOfError | null> = E extends null ? ResponseForm<T> : ResponseForm<T> | E;
