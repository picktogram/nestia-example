import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/tables/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ERROR } from '@root/config/constant/error';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

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
}
