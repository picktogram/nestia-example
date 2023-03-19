import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { AlarmsController } from '../controllers/alarms.controller';
import { AlarmsRepository } from '../models/repositories/alarms.repository';
import { AlarmsService } from '../providers/alarms.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([AlarmsRepository])],
  controllers: [AlarmsController],
  providers: [AlarmsService],
})
export class AlarmsModule {}
