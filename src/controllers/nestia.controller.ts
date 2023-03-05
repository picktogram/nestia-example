import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { TestDto } from '../types';

interface ABC {
  /**
   * abc
   */
  abc: boolean;
}

@Controller('nestia')
export class NestiaController {
  constructor() {}

  /**
   * it's very important API -> it will be summary of API document.
   *
   * if you want to use... -> description of API document.
   *
   * @param id
   * @returns true, just return true. that's all.
   */
  @TypedRoute.Post(':id')
  async nestiaTest(@TypedParam('id', 'number') id: number) {
    return true;
  }

  @TypedRoute.Post()
  async nestiaTest2(): Promise<ABC> {
    return { abc: true };
  }
}
