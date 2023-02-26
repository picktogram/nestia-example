import { UserEntity } from '../tables/user.entity';

export interface LoginUserDto extends Pick<UserEntity, 'email' | 'password'> {}
