import { Module } from '@nestjs/common';
import { AlarmsController } from '../controllers/alarms.controller';
import { AlarmsService } from '../providers/alarms.service';

@Module({
  controllers: [AlarmsController],
  providers: [AlarmsService],
})
export class AlarmsModule {}
