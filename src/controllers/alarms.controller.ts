import { TypedQuery, TypedRoute } from '@nestia/core';
import { UseGuards, Controller } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { createPaginationForm } from '../interceptors/transform.interceptor';
import { AlarmsService } from '../providers/alarms.service';
import { AlarmType, PaginationDto } from '../types';

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
