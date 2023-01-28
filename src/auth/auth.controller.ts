import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@root/common/decorators/user.decorator';
import { CreateUserDto } from '@root/models/dtos/create-user.dto';
import { LoginUserDto } from '@root/models/dtos/login-user.dto';
import { UsersService } from '@root/providers/users.service';
import { DecodedUserToken } from '@root/types';
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

  @ApiOperation({ summary: '220129 - 이메일과 패스워드를 이용한 로그인' })
  @ApiOkResponse({
    type: String,
    description: '암호화된 토큰, decode하여 사용할 값을 담고 있다.',
  })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@User() user: DecodedUserToken) {
    return this.jwtService.sign({ ...user });
  }
}
