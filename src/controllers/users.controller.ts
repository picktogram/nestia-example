import { Controller, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../providers/users.service';
import { UserId } from '../common/decorators/user-id.decorator';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { createPaginationForm, createResponseForm } from '../interceptors/transform.interceptor';
import { PaginationDto, Try, TryCatch, UserType } from '../types';
import typia from 'typia';
import {
  STILL_UNFOLLOW_USER,
  CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW,
  ALREADY_FOLLOW_USER,
  CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW,
  CANNOT_FOLLOW_MYSELF,
  SELECT_MORE_THAN_ONE_IMAGE,
  CANNOT_FIND_DESIGNER_PROFILE,
} from '../config/errors/business-error';
import { CreateCoverImageMulterOptions } from '../config/multer-s3/multer-option';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isBusinessErrorGuard } from '../config/errors';

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
   * @summary 230129 - 이미지를 저장하고, 저장된 경로를 받아오는 API로, key는 file 이라는 명칭, 최대 이미지 수는 10개이다.
   * @tag body-images
   * @param files 저장할 이미지
   * @returns 이미지가 저장되고 난 후의 경로의 배열
   */
  @UseInterceptors(FilesInterceptor('file', 1, CreateCoverImageMulterOptions()))
  @TypedRoute.Post('profile/cover')
  async uploadCoverImage(
    @UploadedFiles() files: Express.MulterS3.File[],
  ): Promise<TryCatch<string[], SELECT_MORE_THAN_ONE_IMAGE>> {
    if (!files?.length) {
      return typia.random<SELECT_MORE_THAN_ONE_IMAGE>();
    }
    const locations = files.map(({ location }) => location);
    return createResponseForm(locations);
  }

  /**
   * @summary 디자이너가 자신의 프로필을 조회하는 API (legacy)
   *
   * @tag users
   * @param user
   * @returns 유저의 토큰을 디코딩한 것과 동일한 형태의 값들이 반환된다.
   */
  @TypedRoute.Get('profile')
  async getProfile(@UserId() userId: number): Promise<TryCatch<UserType.DetailProfile, CANNOT_FIND_DESIGNER_PROFILE>> {
    const user = await this.usersService.getUserProfile(userId);
    if (isBusinessErrorGuard(user)) {
      return user;
    }
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
   */
  @TypedRoute.Delete(':id/follow')
  async unfollow(
    @UserId() userId: number,
    @TypedParam('id', 'number') followeeId: number,
  ): Promise<TryCatch<true, STILL_UNFOLLOW_USER | CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW>> {
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
   */
  @TypedRoute.Post(':id/follow')
  async follow(
    @UserId() userId: number,
    @TypedParam('id', 'number') followeeId: number,
  ): Promise<TryCatch<true, ALREADY_FOLLOW_USER | CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW | CANNOT_FOLLOW_MYSELF>> {
    if (userId === followeeId) {
      return typia.random<CANNOT_FOLLOW_MYSELF>();
    }
    const response = await this.usersService.follow(userId, followeeId);
    return response === true ? createResponseForm(response) : response;
  }

  /**
   * @summary 디자이너 프로필 조회로, 자기 자신을 조회할 경우에는 myself 값이 true로 온다.
   *
   * @tag users
   * @param userId
   * @param designerId
   * @returns 유저의 상세한 프로필
   */
  @TypedRoute.Get(':id')
  async getDetailProdfile(
    @UserId() userId: number,
    @TypedParam('id', 'number') designerId: number,
  ): Promise<TryCatch<UserType.DetailProfile, CANNOT_FIND_DESIGNER_PROFILE>> {
    const designerProfile = await this.usersService.getUserProfile(designerId);
    if (isBusinessErrorGuard(designerProfile)) {
      return designerProfile;
    }
    return createResponseForm({ ...designerProfile, myself: userId === designerId });
  }
}
