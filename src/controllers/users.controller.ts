import { Controller, UseGuards } from '@nestjs/common';
import { DecodedUserToken, UserEntity } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { createPaginationForm, createResponseForm, ResponseForm } from '../interceptors/transform.interceptor';
import { PaginationDto, UserType } from '../types';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   *  친구 추천 기능
   *  유저가 자신의 친구일 수 있는 사람, 유명인 등을 조회하는 API로, 일종의 친구 추천 기능을 의미한다.
   *
   * @tag users
   * @param userId 유저 아이디
   * @returns
   */
  @TypedRoute.Get('acquaintance')
  async getAcquaintance(
    @UserId() userId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<UserType.getAcquaintanceResponse> {
    const acquaintances = await this.usersService.getAcquaintance(userId, paginationDto);
    return createPaginationForm(acquaintances, paginationDto);
  }

  /**
   * 디자이너 프로필 조회 & 토큰에 담긴 값 Parsing
   *
   * @tag users
   * @param user
   * @returns 유저의 토큰을 디코딩한 것과 동일한 형태의 값들이 반환된다.
   */
  @TypedRoute.Get('profile')
  async getProfile(@User() user: UserEntity): Promise<ResponseForm<DecodedUserToken>> {
    return createResponseForm(user);
  }

  /**
   * 230210 - 디자이너님이 다른 디자이너님을 언팔로우하는 API (수정 필요)
   * @tag users
   * @param userId
   * @param followeeId
   * @returns 성공 시 true를 반환한다.
   */
  @TypedRoute.Delete(':id/follow')
  async unfollow(
    @UserId() userId: number,
    @TypedParam('id', 'number') followeeId: number,
  ): Promise<ResponseForm<true>> {
    const response = await this.usersService.unfollow(userId, followeeId);
    return createResponseForm(response);
  }

  /**
   * 230207 - 디자이너님이 다른 디자이너님을 팔로우하는 API (수정 필요)
   *
   * @tag users
   * @param userId
   * @param followeeId
   * @returns 성공 시 true를 반환한다.
   */
  @TypedRoute.Post(':id/follow')
  async follow(@UserId() userId: number, @TypedParam('id', 'number') followeeId: number): Promise<ResponseForm<true>> {
    const response = await this.usersService.follow(userId, followeeId);
    return createResponseForm(response);
  }
}
