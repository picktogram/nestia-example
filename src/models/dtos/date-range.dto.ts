import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalDate } from '../../decorators/is-optional-date.decorator';

export class DateRangeDto {
  @ApiProperty({
    name: 'startDate',
    type: Date,
    description: '시작 날짜로, 없을 경우에는 제한 없음이 된다.',
    required: false,
  })
  @IsOptionalDate()
  startDate?: Date;

  @ApiProperty({
    name: 'endDate',
    type: Date,
    description: '종료 날짜로, 없을 경우에는 제한 없음이 된다.',
    required: false,
  })
  @IsOptionalDate()
  endDate?: Date;
}
