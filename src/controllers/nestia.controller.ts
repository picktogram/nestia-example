import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { TestDto } from '../types';

@Controller('nestia')
export class NestiaController {
  constructor() {}

  /**
   * it's very important API.
   *
   * how to use? read bellow!
   *
   * @param id maybe you know already
   * @returns true, just return true. that's all.
   */
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
