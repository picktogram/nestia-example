import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

const UNCHATCHED_ERROR = '서버에서 캐치되지 못한 에러입니다.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { now: number }>();
    const status = exception.getStatus();

    const { code, message } = exception.getResponse() as any;
    const { path, user, body, query } = request;
    const requestToResponse = Date.now() - request.now;

    console.log(
      `error\n${request.method} ${path} ${requestToResponse}ms\n` +
        `currentTime : ${new Date()}]\n`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,

      errorCode: code ?? 4000,
      errorMessage: code ? message : UNCHATCHED_ERROR,
      requestToResponse,
    });
  }
}
