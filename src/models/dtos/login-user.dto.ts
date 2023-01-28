import { PickType } from '@nestjs/swagger';
import { User } from '../tables/user';

export class LoginUserDto extends PickType(User, [
  'email',
  'password',
] as const) {}
