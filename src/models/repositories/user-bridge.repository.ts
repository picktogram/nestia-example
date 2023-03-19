import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserBridgeEntity } from '../tables/user-bridge.entity';

@CustomRepository(UserBridgeEntity)
export class UserBridgesRepository extends Repository<UserBridgeEntity> {}
