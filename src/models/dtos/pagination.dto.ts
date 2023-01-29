import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from '@root/decorators/is-optional-number.decorator';

export class PaginationDto {
  @ApiProperty({
    name: 'limit',
    example: 10,
    description: '한 번에 조회할 데이터의 수로 기본 값은 10',
    required: false,
  })
  @IsOptionalNumber()
  limit?: number = 10;

  @ApiProperty({
    name: 'page',
    example: 1,
    description: '페이지로, 기본 값은 1',
    required: false,
  })
  @IsOptionalNumber()
  page?: number = 1;
}
