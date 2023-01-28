import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/tables/user';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../models/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const users = await this.usersRepository.find({
      where: [
        { email: createUserDto.email },
        { phoneNumber: createUserDto.phoneNumber },
      ],
    });

    if (users.length) {
      // throw new BadRequestException(
      return '이미 해당 전화번호나 이메일로 만들어진 유저가 있습니다.';
      // );
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
        phoneNumber: true,
        email: true,
        password: true,
        birth: true,
        gender: true,
      },
      where: { email },
    });
  }

  async findOne(userId: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}
