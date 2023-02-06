import { CustomRepository } from '@root/config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../tables/user.entity';

@CustomRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}
