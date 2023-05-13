import { Injectable, flatten } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedUserToken, UserEntity } from '../models/tables/user.entity';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { UsersRepository } from '../models/repositories/users.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import bcrypt from 'bcrypt';
import { Merge, PaginationDto, UserBridgeType, UserType, ValueOfError } from '../types';
import { getOffset } from '../utils/getOffset';
import { ArticleEntity } from '../models/tables/article.entity';
import { CommentEntity } from '../models/tables/comment.entity';
import { In } from 'typeorm';
import {
  STILL_UNFOLLOW_USER,
  CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW,
  ALREADY_FOLLOW_USER,
  CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW,
  ALREADY_CREATED_EMAIL,
  ALREADY_CREATED_PHONE_NUMBER,
  CANNOT_FIND_DESIGNER_PROFILE,
} from '../config/errors/business-error';
import typia from 'typia';
import { ArticlesRepository } from '../models/repositories/articles.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    @InjectRepository(UserBridgesRepository) private readonly userBridgesRepository: UserBridgesRepository,
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
  ) {}

  async updateProfile(userId: number, updateUserDto: UserType.UpdateUserDto): Promise<true> {
    await this.usersRepository.update({ id: userId }, updateUserDto);
    return true;
  }

  async getUserProfile(designerId: number): Promise<UserType.DetailProfile | CANNOT_FIND_DESIGNER_PROFILE> {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        birth: true,
        introduce: true,
        profileImage: true,
        coverImage: true,
      },
      where: { id: designerId },
    });

    if (!user) {
      return typia.random<CANNOT_FIND_DESIGNER_PROFILE>();
    }

    return user;
  }

  async checkReputation(designerId: number): Promise<UserType.Retuation> {
    const reputation = await this.usersRepository
      .createQueryBuilder('u')
      .select('u.id AS "id"')
      .addSelect((qb) => {
        return qb
          .select('COUNT(*)::int4')
          .from(ArticleEntity, 'a')
          .where('a.writerId = u.id')
          .andWhere('a.type = :type', { type: 'question' });
      }, 'question')
      .addSelect((qb) => {
        return qb.select('COUNT(*)::int4').from(CommentEntity, 'c').where('c.writerId = u.id');
      }, 'answer')
      .addSelect((qb) => {
        return qb.select('COUNT(*)::int4').from(ArticleEntity, 'a').where('a.writerId = u.id');
      }, 'writing')
      .where('u.id = :designerId', { designerId })
      .getRawOne();

    return { ...reputation, adopted: 0, likes: 0 } as UserType.Retuation;
  }

  async getAcquaintance(
    userId: number,
    { page, limit }: PaginationDto,
  ): Promise<{ list: UserType.Acquaintance[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });

    const followedBridges = await this.userBridgesRepository.find({
      where: { secondUserId: userId },
      order: { firstUserId: 'DESC' },
    });
    const followeeIds = followedBridges.map((el) => el.firstUserId);
    const isReversed = await this.userBridgesRepository.find({
      where: { firstUserId: userId, secondUser: In(followeeIds) },
      order: { secondUserId: 'DESC' },
    });

    const reversed = isReversed.map((el) => el.secondUserId);
    const nonReversed = followeeIds.filter((el) => !reversed.includes(el));

    const query = this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id AS "id"', 'u.nickname AS "nickname"', 'u.profileImage AS "profileImage"'])
      .where('u.id IN (:...nonReversed)', { nonReversed: nonReversed?.length ? nonReversed : [0] })
      .offset(skip)
      .limit(take);

    const [list, count]: [UserType.Profile[], number] = await Promise.all([query.getRawMany(), query.getCount()]);

    return {
      list: list.map((profile): UserType.Acquaintance => {
        return { ...profile, reason: '나를 팔로우한 사람' };
      }),
      count,
    };
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserEntity | ALREADY_CREATED_EMAIL | ALREADY_CREATED_PHONE_NUMBER> {
    const alreadyCreatedEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (alreadyCreatedEmail) {
      return typia.random<ALREADY_CREATED_EMAIL>();
    }

    const alreadyCreatedPhoneNumber = await this.usersRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (alreadyCreatedPhoneNumber) {
      return typia.random<ALREADY_CREATED_PHONE_NUMBER>();
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.usersRepository.save(
      UserEntity.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    );
  }

  async findOneByEmail(email: string): Promise<(DecodedUserToken & { password: string }) | null> {
    return await this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        password: true,
        birth: true,
        gender: true,
      },
      where: { email },
    });
  }

  async unfollow(
    followerId: number,
    followeeId: number,
  ): Promise<true | STILL_UNFOLLOW_USER | CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW> {
    const response = await this.getFolloweeOrThrow(followerId, followeeId);
    if (!response.result) {
      return typia.random<CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW>();
    }

    if (!response.bridge) {
      return typia.random<STILL_UNFOLLOW_USER>();
    }

    await this.userBridgesRepository.delete({ firstUserId: followerId, secondUserId: followeeId });
    return true;
  }

  async follow(
    followerId: number,
    followeeId: number,
  ): Promise<true | ALREADY_FOLLOW_USER | CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW> {
    const response = await this.getFolloweeOrThrow(followerId, followeeId);
    if (!response.result) {
      return typia.random<CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW>();
    }

    if (response.bridge) {
      return typia.random<ALREADY_FOLLOW_USER>();
    }

    await this.userBridgesRepository.save({ firstUserId: followerId, secondUserId: followeeId });
    return true;
  }

  async checkFollowees(designerId: number, { page, limit }: PaginationDto): Promise<UserType.ProfileList> {
    const { skip, take } = getOffset({ page, limit });

    const query = this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id AS "id"', 'u.nickname AS "nickname"', 'u.profileImage AS "profileImage"'])
      .innerJoin('u.firstUserBridges', 'fub', 'fub.secondUserId = :designerId', { designerId })
      .offset(skip)
      .limit(take);

    const [list, count]: [UserType.Profile[], number] = await Promise.all([query.getRawMany(), query.getCount()]);
    return {
      list: list.map((el) => {
        return { ...el, reason: '나를 팔로우한 사람' };
      }),
      count,
    };
  }

  async getRelation(followerId: number, followeeId: number): Promise<UserBridgeType.FollowStatus> {
    const response = await this.getFolloweeOrThrow(followerId, followeeId);
    if (response.result === false) {
      return 'nothing';
    } else {
      if (response.bridge && response.reversedBridge) {
        return 'followUp';
      } else if (response.bridge) {
        return 'follow';
      } else if (response.reversedBridge) {
        return 'reverse';
      }
      return 'nothing';
    }
  }

  /**
   *
   * @param followerId 팔로우 하는 사람
   * @param followeeId 팔로우 당하는 사람
   * @param customError 유저가 없을 경우에 대한 에러 처리
   * @returns
   */
  private async getFolloweeOrThrow(followerId: number, followeeId: number) {
    const [followee, bridge, reversedBridge] = await Promise.all([
      this.usersRepository.findOne({ where: { id: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followerId, secondUserId: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followeeId, secondUserId: followerId } }),
    ]);

    if (!followee) {
      return { result: false as const, followee: null, bridge: null, reversedBridge: null };
    }

    return { result: true as const, followee, bridge, reversedBridge };
  }
}
