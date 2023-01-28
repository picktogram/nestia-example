import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@root/common/decorators/user.decorator';
import { CreateUserDto } from '@root/models/dtos/create-user.dto';
import { LoginUserDto } from '@root/models/dtos/login-user.dto';
import { User as UserEntity } from '@root/models/tables/user';
import { UsersService } from '@root/providers/users.service';
import { LocalGuard } from './guards/local.guard';

@ApiTags('권한 / Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '220129 - Local 로그인을 위한 User 생성' })
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '이메일과 패스워드를 이용한 로그인' })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@User() user: UserEntity) {
    return this.jwtService.sign(user);
  }
}
