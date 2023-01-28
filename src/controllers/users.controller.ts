import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User as UserEntity } from '../models/tables/user';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('유저 / User')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'MVP : 유저 프로필 조회 & 토큰에 담긴 값 Parsing.' })
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@User() user: UserEntity) {
    return user;
  }
}
