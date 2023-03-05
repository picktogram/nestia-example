import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('api/v1/calendar')
export class CalendarController {
  constructor() {}

  /**
   * 달력을 조회한다.
   *
   * 아래 내 일정, 이벤트 등을
   * 어떻게 구현할지에 따라 body는 달리 작성해도 되며, 작성 후에는 types/index.ts에 옮겨줄 것
   * 아래는 그저 예시일 뿐이니 반드시 따를 피요는 없다.
   */
  @TypedRoute.Get()
  async show(
    @TypedBody()
    body: {
      /**
       * 달력에서 표시하고 싶지 않은 이벤트 또는 디자이너 등을 의미하는, 식별할 수 있는 값
       */
      exclude: number[];

      /**
       * 달력의 기준 월을 의미하며 반드시 1일의 날짜여야 한다.
       * 또한 이 날짜가 없을 시에는 현재 시간을 기준으로 해당 월의 일정을 보여준다.
       */
      standardDate?: Date;
    },
  ) {}
}
