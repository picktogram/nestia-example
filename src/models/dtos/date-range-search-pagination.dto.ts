import { DateRangeDto } from './date-range.dto';
import { SearchPaginationDto } from './search-pagination.dto';

export interface DateRangedSearchPaginationDto extends DateRangeDto, SearchPaginationDto {}
