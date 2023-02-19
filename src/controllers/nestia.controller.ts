import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { TestDto } from '@root/types';

@Controller('nestia')
export class NestiaController {
  constructor() {}

  @TypedRoute.Post(':id')
  async nestiaTest(@TypedParam('id', 'number') id: number) {
    console.log('id : ', id);
    return true;
  }

  @TypedRoute.Post()
  async nestiaTest2(@TypedBody() dto: TestDto): Promise<TestDto> {
    console.log(dto);
    return dto;
  }
}
