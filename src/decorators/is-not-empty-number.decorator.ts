import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export function IsNotEmptyNumber() {
  return applyDecorators(
    IsInt(),
    IsNotEmpty(),
    Type(() => Number),
  );
}
