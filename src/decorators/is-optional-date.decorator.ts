import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export function IsOptionalDate() {
  return applyDecorators(
    IsOptional(),
    IsDate(),
    Type(() => Date),
  );
}
