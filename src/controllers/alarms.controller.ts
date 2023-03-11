import { TypedQuery, TypedRoute } from '@nestia/core';
import { UseGuards, Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { createPaginationForm, ResponseForm } from '../interceptors/transform.interceptor';
import { AlarmsService } from '../providers/alarms.service';
import { AlarmType, PaginationDto } from '../types';

@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @TypedRoute.Get()
  async read(
    @UserId() userId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<AlarmType.ReadResponseType> {
    const response = await this.alarmsService.read(userId, paginationDto);
    return createPaginationForm(response, paginationDto);
  }
}
