import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { path, user, body, query } = request;

    const requestToResponse = Date.now() - request.now;
    return next.handle().pipe(
      tap((response) => {
        console.log(
          `logging\n${request.method} ${path} ${requestToResponse}ms\n` +
            `currentTime : ${new Date()}]\n`,
        );
      }),
    );
  }
}
