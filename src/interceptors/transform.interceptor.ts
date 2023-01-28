import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { NON_PAGINATION } from '@root/config/constant';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const calcListTotalCount = (
  totalCount = 0,
  limit = 0,
): { totalResult: number; totalPage: number } => {
  const totalResult = totalCount;
  const totalPage =
    totalResult % limit === 0
      ? totalResult / limit
      : Math.floor(totalResult / limit) + 1;
  return { totalResult, totalPage };
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ExtendedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExtendedResponse<T>> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((value) => {
        if (value instanceof Object && 'count' in value && 'list' in value) {
          const { list, count, ...restData } = value;

          const limit = request.query['limit']
            ? request.query['limit']
            : NON_PAGINATION;
          const page = request.query['page'];
          const search = request.query['search'];

          return {
            result: true,
            code: 1000,
            data: {
              ...restData,
              list,
              ...(limit === NON_PAGINATION
                ? { totalResult: count, totalPage: 1 }
                : calcListTotalCount(count, Number(limit))),
              ...(search ? { search } : { search: null }),
              ...(page && { page }),
            } as ListOutputValue,
          };
        }

        return { result: true, code: 1000, data: value };
      }),
    );
  }
}
