import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "../models/tables/category.entity";
import {Repository} from "typeorm";
import {CalendarEntitiy} from "../models/tables/calendar.entitiy";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntitiy)
    private readonly calendarRepository: Repository<CalendarEntitiy>,
  ) {}
//  여기 뭘 구현해야하는지 잘 모르겠어요 ㅎㅎ
}
