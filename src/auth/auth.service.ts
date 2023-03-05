import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../models/tables/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@root/providers/users.service';
import { DecodedUserToken } from '@root/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<DecodedUserToken> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isRightPassword = await bcrypt.compare(password, user.password);
      if (isRightPassword) {
        const { password, ...rest } = user;
        return rest;
      }
    }
    return null;
  }

  userLogin(user: DecodedUserToken) {
    const token = this.jwtService.sign({ ...user });
    return { token };
  }

  async findOrCreateGoogleUser(user: DecodedUserToken): Promise<{ jwt: string }> {
    const { id, nickname, email } = user;
    const payload = { sub: id, name: nickname, email };
    const jwt = this.jwtService.sign(payload);
    return { jwt };
  }
}
