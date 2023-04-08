import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedUserToken, UserEntity } from '../models/tables/user.entity';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { ERROR } from '../config/legacy/error';
import { UsersRepository } from '../models/repositories/users.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import bcrypt from 'bcrypt';
import { PaginationDto, UserType, ValueOfError } from '../types';
import { UserBridgeEntity } from '../models/tables/user-bridge.entity';
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
} from '../config/errors/business-error';
import typia from 'typia';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    @InjectRepository(UserBridgesRepository) private readonly userBridgesRepository: UserBridgesRepository,
  ) {}

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
  ): Promise<{ list: UserType.Profile[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });
    // const query = this.userBridgesRepository
    //   .createQueryBuilder('u')
    //   .select(['u.id AS "id"', 'u.nickname AS "nickname"', 'u.profileImage AS "profileImage"'])
    //   .innerJoin('ub.secondUser', 'u', 'u.id = :userId', { userId })
    //   .where((qb) => {
    //     // NOTE : 내가 팔로우를 당했음에도 상대를 팔로우하지 않은 경우를 추천한다.
    //     const subQuery = qb
    //       .subQuery()
    //       .select('COUNT(*)')
    //       .from(UserBridgeEntity, 'sub')
    //       .where('sub.firstUserId = :userId', { userId })
    //       .andWhere('sub.secondUserId = ub.firstUserId') // 내가 상대를 팔로우한 횟수가 0인 경우, 즉 팔로우 안 한 경우
    //       .getQuery();

    //     return `${subQuery} = 0`;
    //   })
    //   .offset(skip)
    //   .limit(take);

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

    return { list, count };
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
    const response = await this.getFolloweeOrThrow(
      followerId,
      followeeId,
      typia.random<CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW>(),
    );
    if (!response.result) {
      return response;
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
    const response = await this.getFolloweeOrThrow(
      followerId,
      followeeId,
      typia.random<CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW>(),
    );
    if (!response.result) {
      return response;
    }

    if (response.bridge) {
      return typia.random<ALREADY_FOLLOW_USER>();
    }

    await this.userBridgesRepository.save({ firstUserId: followerId, secondUserId: followeeId });
    return true;
  }

  private async getFolloweeOrThrow<T extends ValueOfError>(followerId: number, followeeId: number, customError: T) {
    const [followee, bridge, reversedBridge] = await Promise.all([
      this.usersRepository.findOne({ where: { id: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followerId, secondUserId: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followeeId, secondUserId: followerId } }),
    ]);

    if (!followee) {
      return customError;
    }

    return { result: true as const, followee, bridge, reversedBridge };
  }
}
