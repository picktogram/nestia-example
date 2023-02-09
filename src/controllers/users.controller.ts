import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBridgeEntity } from '@root/models/tables/userBridge.entity';
import { UserId } from '@root/common/decorators/user-id.decorator';

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

  @Delete(':id/follow')
  async unfollow(@UserId() userId: number, @Param('id', ParseIntPipe) followeeId: number) {}

  @ApiOperation({ summary: '230207 - 디자이너님이 다른 디자이너님을 팔로우하는 API' })
  @ApiOkResponse({ type: UserBridgeEntity })
  @Post(':id/follow')
  async follow(@UserId() userId: number, @Param('id', ParseIntPipe) followeeId: number) {
    const response = await this.usersService.follow(userId, followeeId);
    return response;
  }
}
