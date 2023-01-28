import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User as UserEntity } from '../models/tables/user';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('유저 / User')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'MVP : Local 로그인을 위한 User 생성' })
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'MVP : 유저 프로필 조회 & 토큰에 담긴 값 Parsing.' })
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@User() user: UserEntity) {
    return user;
  }
}
