import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@root/models/dtos/create-user.dto';
import { LoginUserDto } from '@root/models/dtos/login-user.dto';
import { UsersService } from '@root/providers/users.service';
import { LocalGuard } from './guards/local.guard';

@ApiTags('권한 / Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'MVP : Local 로그인을 위한 User 생성' })
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @ApiOperation({ summary: '이메일과 패스워드를 이용한 로그인' })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
