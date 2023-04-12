import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { SlackService } from '../../external/slack/slack.service';
import { Request, Response } from 'express';
import { NestiaTypeErrorObject } from '../../types';

const UNCHATCHED_ERROR = '서버에서 캐치되지 못한 에러입니다.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
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

      const { path, user, query } = request;
      const requestToResponse = `${Date.now() - request.now}ms`;

      console.log(`error\n${request.method} ${path} ${requestToResponse}\n` + `currentTime : ${new Date()}]\n`);

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

        if (
          message === 'Response body data is not following the promised type.' ||
          message === 'Request body data is not following the promised type.'
        ) {
          // NOTE : validation error
          const nestiaTypeError: NestiaTypeErrorObject = exception.getResponse() as NestiaTypeErrorObject;
          slackMessageForm += `\tpath : ${nestiaTypeError.path}\n`;
          slackMessageForm += `\treason : ${nestiaTypeError.reason}\n`;
          slackMessageForm += `\texpected : ${nestiaTypeError.expected}\n`;
          slackMessageForm += `\tvalue : ${nestiaTypeError.value}\n`;
        } else {
          slackMessageForm += `errorMessage: ${message}\n`;
          slackMessageForm += `errorStack: 아래 메시지 참고\n`;

          exception?.stack?.split('\n').forEach((stackMessage) => {
            slackMessageForm += `\t${stackMessage}\n`;
          });
        }

        console.error(slackMessageForm);

        // this.slackService.sendToServerErrorChannel(slackMessageForm);
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,

        errorCode: code ?? 4000,
        errorMessage: (code ?? 4000) === 4000 ? UNCHATCHED_ERROR : message,
        requestToResponse,
      });
      return;
    }

    if (exception instanceof Error) {
      console.error('exception', exception.message);
      console.error('exception', exception.stack);

      // TODO : 정리 필요
      response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,

        errorCode: 4000,
        errorMessage: exception.message,
      });
      return;
    }

    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,

      errorCode: 4000,
      errorMessage: `I DON'T KNOW WHAT HAPPENS.`,
    });
    return;
  }
}
