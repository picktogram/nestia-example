import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpAdapterHost,
} from '@nestjs/common';
import { SlackService } from '@root/external/slack/slack.service';
import { Request, Response } from 'express';

const UNCHATCHED_ERROR = '서버에서 캐치되지 못한 에러입니다.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}

  /**
   * TODO : unCatched Error handling 필요
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { now: number }>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const { path, user, body, query } = request;
      const requestToResponse = `${Date.now() - request.now}ms`;

      console.log(
        `error\n${request.method} ${path} ${requestToResponse}\n` +
          `currentTime : ${new Date()}]\n`,
      );

      const { code, message } = exception.getResponse() as any;

      if (message instanceof Array) {
        // NOTE : validation error
        response.status(400).json({
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: request.url,
          errorCode: 4000,
          errorMessage: message,
          requestToResponse,
        });
        return;
      } else if (!code) {
        // NOTE : validation 에러가 아니면서 서버에서 정의하지 않은 에러
        let slackMessageForm = `error\n`;
        slackMessageForm += `${request.method} ${path} ${exception}\n`;
        slackMessageForm += `user : ${JSON.stringify(user)}\n`;
        slackMessageForm += `query : ${JSON.stringify(query)}\n`;
        slackMessageForm += `date : ${new Date()}\n`;

        slackMessageForm += `errorMessage: ${message}\n`;
        slackMessageForm += `errorStack: 아래 메시지 참고\n`;
        exception.stack.split('\n').forEach((stackMessage) => {
          slackMessageForm += `\t${stackMessage}\n`;
        });

        this.slackService.sendToServerErrorChannel(slackMessageForm);
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,

        errorCode: code ?? 4000,
        errorMessage: code ? message : UNCHATCHED_ERROR,
        requestToResponse,
      });
    }

    // TODO : 정리 필요
    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,

      errorCode: 4000,
      errorMessage:
        'UnCatchedError : 추후 더 디테일한 정보를 담도록 수정할 예정',
    });
  }
}
