import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR } from '@root/config/constant/error';
import { DecodedUserToken } from '@root/types';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = DecodedUserToken>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info.message === 'No auth token') {
      throw new BadRequestException(ERROR.NO_AUTH_TOKEN);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
