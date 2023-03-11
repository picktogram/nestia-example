import { UseGuards, Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AlarmsService } from '../providers/alarms.service';

@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}
}
