import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEntitiy } from '../models/tables/calendar.entitiy';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntitiy)
    private readonly calendarRepository: Repository<CalendarEntitiy>,
  ) {}
}
