import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../tables/user.entity';

export class LoginUserDto extends PickType(UserEntity, ['email', 'password'] as const) {}
