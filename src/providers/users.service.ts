import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/tables/user.entity';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { ERROR, ValueOfError } from '@root/config/constant/error';
import { UsersRepository } from '@root/models/repositories/users.repository';
import { UserBridgesRepository } from '@root/models/repositories/user-bridge.repository';

import bcrypt from 'bcrypt';
import { DecodedUserToken } from '@root/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    @InjectRepository(UserBridgesRepository) private readonly userBridgesRepository: UserBridgesRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const users = await this.usersRepository.find({
      where: [{ email: createUserDto.email }, { phoneNumber: createUserDto.phoneNumber }],
    });

    if (users.length) {
      throw new BadRequestException(ERROR.ALREADY_CREATED_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.usersRepository.save(
      UserEntity.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    );
  }

  async findOneByEmail(email: string): Promise<DecodedUserToken & { password: string }> {
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

  async findOne(userId: number): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  async unfollow(followerId: number, followeeId: number): Promise<true> {
    const { followee, bridge, reversedBridge } = await this.getFolloweeOrThrow(
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
    const { followee, bridge, reversedBridge } = await this.getFolloweeOrThrow(
      followerId,
      followeeId,
      ERROR.CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW,
    );

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
