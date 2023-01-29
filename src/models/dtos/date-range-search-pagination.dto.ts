import { IntersectionType } from '@nestjs/swagger';
import { DateRangeDto } from './date-range.dto';
import { SearchPaginationDto } from './search-pagination.dto';

export class DateRangedSearchPaginationDto extends IntersectionType(
  DateRangeDto,
  SearchPaginationDto,
) {}
