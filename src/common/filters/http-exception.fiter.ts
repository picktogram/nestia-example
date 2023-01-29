import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { SlackService } from '@root/external/slack/slack.service';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { now: number }>();
    const status = exception.getStatus();

    const { code, message } = exception.getResponse() as any;
    const requestToResponse = `${Date.now() - request.now}ms`;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,

      errorCode: code,
      errorMessage: message,
      requestToResponse,
    });
  }
}
