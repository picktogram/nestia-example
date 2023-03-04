import {Controller, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../auth/guards/jwt.guard";
import { CalendarService } from "../providers/calendar.service";

@UseGuards(JwtGuard)
@Controller('api/v1/calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
  ) {}
}
