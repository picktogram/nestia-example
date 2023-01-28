import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export const ParseOptionalBoolean = () =>
  Transform((params) => {
    return optionalBooleanMapper.get(String(params.value));
  });

export function IsOptionalBoolean() {
  return applyDecorators(IsOptional(), ParseOptionalBoolean(), IsBoolean());
}
