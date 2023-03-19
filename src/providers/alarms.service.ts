import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmsRepository } from '../models/repositories/alarms.repository';
import { AlarmType, PaginationDto } from '../types';
import { getOffset } from '../utils/getOffset';

@Injectable()
export class AlarmsService {
  constructor(@InjectRepository(AlarmsRepository) private readonly alarmsRepository: AlarmsRepository) {}

  async read(userId: number, { page, limit }: PaginationDto): Promise<{ list: AlarmType.Element[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });
    const [list, count]: [AlarmType.Element[], number] = await this.alarmsRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        resourceName: true,
        resourceId: true,
        redirectLink: true,
      },
      skip,
      take,
    });
    return { list, count };
  }
}
