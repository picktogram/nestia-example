import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchDto {
  @ApiProperty({ name: 'search', description: '검색어', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}
