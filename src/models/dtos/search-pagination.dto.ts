import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { SearchDto } from './search.dto';

export class SearchPaginationDto extends IntersectionType(
  PaginationDto,
  SearchDto,
) {}
