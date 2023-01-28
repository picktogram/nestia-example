import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function IsNotEmptyString(min: number, max: number) {
  return applyDecorators(IsNotEmpty(), IsString(), Length(min, max));
}
