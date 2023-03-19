import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { AlarmEntity } from '../tables/alarm.entity';

@CustomRepository(AlarmEntity)
export class AlarmsRepository extends Repository<AlarmEntity> {}
