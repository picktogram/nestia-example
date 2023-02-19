import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserBridgeEntity } from '../tables/userBridge.entity';

@CustomRepository(UserBridgeEntity)
export class UserBridgesRepository extends Repository<UserBridgeEntity> {}
