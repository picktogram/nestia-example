import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export function IsOptionalNumber() {
  return applyDecorators(
    IsOptional(),
    IsInt(),
    Type(() => Number),
  );
}
