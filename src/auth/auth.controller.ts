import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '@root/models/dtos/login-user.dto';
import { LocalGuard } from './guards/local.guard';

@ApiTags('권한 / Auth')
@Controller('api/auth')
export class AuthController {
  @ApiOperation({ summary: '이메일과 패스워드를 이용한 로그인' })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
