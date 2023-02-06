import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/tables/user.entity';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import { ERROR } from '@root/config/constant/error';
import { UsersRepository } from '@root/models/repositories/users.repository';
import { UserBridgesRepository } from '@root/models/repositories/user-bridge.repository';

import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    @InjectRepository(UserBridgesRepository) private readonly userBridgesRepository: UserBridgesRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const users = await this.usersRepository.find({
      where: [{ email: createUserDto.email }, { phoneNumber: createUserDto.phoneNumber }],
    });

    if (users.length) {
      throw new BadRequestException(ERROR.ALREADY_CREATED_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOneByEmail(email: string) {
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

  async follow(followerId: number, followeeId: number) {
    const [followee, bridge] = await Promise.all([
      this.usersRepository.findOne({ where: { id: followeeId } }),
      this.userBridgesRepository.findOne({
        where: { firstUserId: followerId, secondUserId: followeeId },
      }),
    ]);

    if (bridge) {
      throw new BadRequestException(ERROR.ALREADY_FOLLOW_USER);
    }

    if (!followee) {
      throw new BadRequestException(ERROR.CANNOT_FIND_ONE_DESIGNER);
    }

    const reversedBridge = await this.userBridgesRepository.findOne({
      where: { firstUserId: followee.id, secondUserId: followerId },
    });

    if (reversedBridge) {
      return await this.userBridgesRepository.save({
        firstUserId: followee.id,
        secondUserId: followerId,
        status: 'followUp',
      });
    }

    return await this.userBridgesRepository.save({ firstUserId: followerId, secondUserId: followeeId });
  }
}
