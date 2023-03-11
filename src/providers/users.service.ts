import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedUserToken, UserEntity } from '../models/tables/user.entity';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { ERROR, ValueOfError } from '../config/constant/error';
import { UsersRepository } from '../models/repositories/users.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import bcrypt from 'bcrypt';
import { PaginationDto, UserType } from '../types';
import { UserBridgeEntity } from '../models/tables/userBridge.entity';
import { getOffset } from '../utils/getOffset';
import { ArticleEntity } from '../models/tables/article.entity';
import { CommentEntity } from '../models/tables/comment.entity';

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
      }, 'article')
      .addSelect((qb) => {
        return qb.select('COUNT(*)::int4').from(CommentEntity, 'c').where('c.writerId = u.id');
      }, 'answer')
      .addSelect((qb) => {
        return qb.select('COUNT(*)::int4').from(ArticleEntity, 'a').where('a.writerId = u.id');
      }, 'article')
      .where('u.id = :designerId', { designerId })
      .getRawOne();

    return { ...reputation, adopted: 0, like: 0 } as UserType.Retuation;
  }

  async getAcquaintance(
    userId: number,
    { page, limit }: PaginationDto,
  ): Promise<{ list: UserType.Profile[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });
    const query = this.userBridgesRepository
      .createQueryBuilder('ub')
      .select(['u.id AS "id"', 'u.nickname AS "nickname"', 'u.profileImage AS "profileImage"'])
      .innerJoin('ub.secondUser', 'u', 'u.id = :userId', { userId })
      .where((qb) => {
        // NOTE : 내가 팔로우를 당했음에도 상대를 팔로우하지 않은 경우를 추천한다.
        const subQuery = qb
          .subQuery()
          .select('COUNT(*)')
          .from(UserBridgeEntity, 'sub')
          .where('sub.firstUserId = :userId', { userId })
          .andWhere('sub.secondUserId = ub.firstUserId')
          .getQuery();

        return `${subQuery} = 0`;
      })
      .offset(skip)
      .limit(take);

    const [list, count]: [UserType.Profile[], number] = await Promise.all([query.getRawMany(), query.getCount()]);

    return { list, count };
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const alreadyCreatedEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (alreadyCreatedEmail) {
      throw new BadRequestException(ERROR.ALREADY_CREATED_EMAIL);
    }

    const alreadyCreatedPhoneNumber = await this.usersRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (alreadyCreatedPhoneNumber) {
      throw new BadRequestException(ERROR.ALREADY_CREATED_PHONE_NUMBER);
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

  async unfollow(followerId: number, followeeId: number): Promise<true> {
    const { bridge } = await this.getFolloweeOrThrow(
      followerId,
      followeeId,
      ERROR.CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW,
    );

    if (!bridge) {
      throw new BadRequestException(ERROR.STILL_UNFOLLOW_USER);
    }

    await this.userBridgesRepository.delete({ firstUserId: followerId, secondUserId: followeeId });
    return true;
  }

  async follow(followerId: number, followeeId: number): Promise<true> {
    const { bridge } = await this.getFolloweeOrThrow(followerId, followeeId, ERROR.CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW);

    if (bridge) {
      throw new BadRequestException(ERROR.ALREADY_FOLLOW_USER);
    }

    await this.userBridgesRepository.save({ firstUserId: followerId, secondUserId: followeeId });
    return true;
  }

  private async getFolloweeOrThrow(followerId: number, followeeId: number, customError: ValueOfError) {
    const [followee, bridge, reversedBridge] = await Promise.all([
      this.usersRepository.findOne({ where: { id: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followerId, secondUserId: followeeId } }),
      this.userBridgesRepository.findOne({ where: { firstUserId: followeeId, secondUserId: followerId } }),
    ]);

    if (!followee) {
      throw new BadRequestException(customError);
    }

    return { followee, bridge, reversedBridge };
  }
}
