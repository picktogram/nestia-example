import { Controller, UseGuards } from '@nestjs/common';
import { DecodedUserToken, UserEntity } from '../models/tables/user.entity';
import { UsersService } from '../providers/users.service';
import { User } from '../common/decorators/user.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { createPaginationForm, createResponseForm } from '../interceptors/transform.interceptor';
import { PaginationDto, Try, TryCatch, UserType } from '../types';
import typia from 'typia';
import { ERROR } from '../config/constant/error';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @summary 친구 추천 기능
   * 유저가 자신의 친구일 수 있는 사람, 유명인 등을 조회하는 API로, 일종의 친구 추천 기능을 의미한다.
   *
   * @tag users
   * @param userId 유저 아이디
   * @returns
   */
  @TypedRoute.Get('acquaintance')
  async getAcquaintance(
    @UserId() userId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<UserType.GetAcquaintanceResponse> {
    const acquaintances = await this.usersService.getAcquaintance(userId, paginationDto);
    return createPaginationForm(acquaintances, paginationDto);
  }

  /**
   * @summary 디자이너 프로필 조회 & 토큰에 담긴 값 Parsing
   *
   * @tag users
   * @param user
   * @returns 유저의 토큰을 디코딩한 것과 동일한 형태의 값들이 반환된다.
   */
  @TypedRoute.Get('profile')
  async getProfile(@User() user: UserEntity): Promise<Try<DecodedUserToken>> {
    return createResponseForm(user);
  }

  /**
   * @summary 유저의 평판을 조회하는 API
   *
   * 유저의 상세 페이지에서 호출되기도 하며, 또한 홈 페이지에서 자기 평판을 조회하기도 한다.
   *
   * @tag users
   * @param userId 유저의 아이디
   * @param designerId 조회하고자 하는 유저의 아이디
   */
  @TypedRoute.Get(':id/reputation')
  async checkReputation(
    @UserId() userId: number,
    @TypedParam('id', 'number') designerId: number,
  ): Promise<Try<UserType.Retuation>> {
    const response = await this.usersService.checkReputation(designerId);
    return createResponseForm(response);
  }

  /**
   * @summary 230313 - 해당 디자이너님의 팔로워 ( 누구를 팔로우하고 있는지 ) 를 조회한다. (미완성)
   * @tag users
   * @param userId 조회를 요청한 사람, 즉 유저
   * @param designerId 조회를 당하는 사람, 즉 해당 디자이너
   * @returns 팔로워 목록의 페이지네이션 값
   */
  @TypedRoute.Get(':id/followers')
  async checkFollowers(
    @UserId() userId: number,
    @TypedParam('id', 'number') designerId: number,
  ): Promise<Try<UserType.GetAcquaintanceResponse>> {
    return createResponseForm(typia.random<UserType.GetAcquaintanceResponse>());
  }

  /**
   * @summary 230313 - 해당 디자이너님의 팔로이 ( 누구를 팔로우하고 있는지 ) 를 조회한다. (미완성)
   * @tag users
   * @param userId 조회를 요청한 사람, 즉 유저
   * @param designerId 조회를 당하는 사람, 즉 해당 디자이너
   * @returns 팔로이 목록의 페이지네이션 값
   */
  @TypedRoute.Get(':id/followees')
  async checkFollowees(
    @UserId() userId: number,
    @TypedParam('id', 'number') designerId: number,
  ): Promise<Try<UserType.GetAcquaintanceResponse>> {
    return createResponseForm(typia.random<UserType.GetAcquaintanceResponse>());
  }

  /**
   * @summary 230210 - 디자이너님이 다른 디자이너님을 언팔로우하는 API (수정 필요)
   * @tag users
   * @param userId
   * @param followeeId
   * @returns 성공 시 true를 반환한다.
   * @throws 4010 아직 팔로우한 적 없는 디자이너님에요!
   * @throws 4011 언팔로우할 디자이너님을 찾지 못했습니다.
   */
  @TypedRoute.Delete(':id/follow')
  async unfollow(
    @UserId() userId: number,
    @TypedParam('id', 'number') followeeId: number,
  ): Promise<TryCatch<true, typeof ERROR.STILL_UNFOLLOW_USER | typeof ERROR.CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW>> {
    const response = await this.usersService.unfollow(userId, followeeId);
    return response === true ? createResponseForm(response) : response;
  }

  /**
   * @summary 230207 - 디자이너님이 다른 디자이너님을 팔로우하는 API
   *
   * @tag users
   * @param userId
   * @param followeeId
   * @returns 성공 시 true를 반환한다.
   * @throws 4008 이미 좋아요를 누른 디자이너님입니다!
   * @throws 4009 팔로우할 디자이너님을 찾지 못했습니다.
   * @throws 4017 설마 자기 자신을 팔로우하려고 했어요?!
   */
  @TypedRoute.Post(':id/follow')
  async follow(
    @UserId() userId: number,
    @TypedParam('id', 'number') followeeId: number,
  ): Promise<
    TryCatch<
      true,
      | typeof ERROR.ALREADY_FOLLOW_USER
      | typeof ERROR.CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW
      | typeof ERROR.CANNOT_FOLLOW_MYSELF
    >
  > {
    if (userId === followeeId) {
      return ERROR.CANNOT_FOLLOW_MYSELF;
    }
    const response = await this.usersService.follow(userId, followeeId);
    return response === true ? createResponseForm(response) : response;
  }
}
