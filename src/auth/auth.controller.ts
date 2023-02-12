import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@root/common/decorators/user.decorator';
import { CreateUserDto } from '@root/models/dtos/create-user.dto';
import { LoginUserDto } from '@root/models/dtos/login-user.dto';
import { UsersService } from '@root/providers/users.service';
import { DecodedUserToken } from '@root/types';
import { LocalGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  @ApiOperation({ summary: '230129 - Local 로그인을 위한 User 생성' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        nickname: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        birth: {
          type: 'string',
          example: new Date(),
        },
        gender: {
          type: 'boolean',
        },
      },
    },
  })
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<DecodedUserToken> {
    const { password, ...user } = await this.usersService.create(createUserDto);
    return user;
  }

  @ApiOperation({ summary: '230129 - 이메일과 패스워드를 이용한 로그인' })
  @ApiOkResponse({
    type: String,
    description: '암호화된 토큰, decode하여 사용할 값을 담고 있다.',
  })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalGuard)
  @Post('login')
  login(@User() user: DecodedUserToken): string {
    console.log('야호');
    return this.jwtService.sign({ ...user });
  }
}
