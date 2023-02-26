import { PaginationDto } from '../../types';
import { SearchDto } from './search.dto';

export interface SearchPaginationDto extends PaginationDto, SearchDto {}
