import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { createResponseForm, ResponseForm } from '../interceptors/transform.interceptor';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { LoginUserDto } from '../models/dtos/login-user.dto';
import { DecodedUserToken } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 230129 - Local 로그인을 위한 User 생성
   *
   * @tag auth
   * @param CreateUserDto 유저를 생성하기 위해 필요한 최소한의 값 정의
   */
  @TypedRoute.Post('sign-up')
  async signUp(@TypedBody() createUserDto: CreateUserDto): Promise<ResponseForm<DecodedUserToken>> {
    const { password, ...user } = await this.usersService.create(createUserDto);
    return createResponseForm(user);
  }

  /**
   * 230129 - 이메일과 패스워드를 이용한 로그인
   *
   * @tag auth
   * @param email string
   * @param password string
   * @returns 암호화된 토큰, decode하여 사용할 값을 담고 있다.
   */
  @UseGuards(LocalGuard)
  @ApiBody({
    description: '로그인에 필요한 유저 인증 정보',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @TypedRoute.Post('login')
  login(@User() user: DecodedUserToken, @TypedBody() body: LoginUserDto): ResponseForm<string> {
    const token = this.jwtService.sign({ ...user });
    return createResponseForm(token);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req: Request): Promise<void> {
    // redirect google login page
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('googleAuthCallback:');
    return res.status(200).json(req.user);
  }
}
