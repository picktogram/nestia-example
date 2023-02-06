import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@ApiTags('User')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'MVP : 유저 프로필 조회 & 토큰에 담긴 값 Parsing' })
  @Get('profile')
  async getProfile(@User() user: UserEntity) {
    return user;
  }

  @Post(':id/follow')
  async follow(@User() userId: number, @Param('id', ParseIntPipe) followeeId: number) {
    const response = await this.usersService.follow(userId, followeeId);
    return response;
  }
}
