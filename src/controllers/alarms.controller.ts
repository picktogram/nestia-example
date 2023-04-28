import { TypedQuery, TypedRoute } from '@nestia/core';
import { UseGuards, Controller, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { createPaginationForm } from '../common/interceptors/transform.interceptor';
import { AlarmsService } from '../providers/alarms.service';
import { AlarmType, PaginationDto } from '../types';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor, TimeoutInterceptor)
@UseGuards(JwtGuard)
@Controller('api/v1/alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  /**
   * @summary 유저가 지금까지 받은 알람을 제공하는 API
   * @tag alarms
   * @param userId
   * @param paginationDto
   * @returns 알람
   */
  @TypedRoute.Get()
  async read(
    @UserId() userId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<AlarmType.ReadResponseType> {
    const response = await this.alarmsService.read(userId, paginationDto);
    return createPaginationForm(response, paginationDto);
  }
}
