import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../common/decorators/user.decorator';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { DecodedUserToken } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { LocalGuard } from './guards/local.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  /**
   * 230129 - Local 로그인을 위한 User 생성
   *
   * @tag auth
   * @param CreateUserDto 유저를 생성하기 위해 필요한 최소한의 값 정의
   */
  @Post('sign-up')
  async signUp(@TypedBody() createUserDto: CreateUserDto): Promise<DecodedUserToken> {
    const { password, ...user } = await this.usersService.create(createUserDto);
    return user;
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
  @TypedRoute.Post('login')
  login(@User() user: DecodedUserToken): string {
    return this.jwtService.sign({ ...user });
  }
}
