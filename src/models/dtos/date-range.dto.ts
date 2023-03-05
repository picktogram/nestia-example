import typia from 'typia';

export interface DateRangeDto {
  /**
   * 시작 날짜로, 없을 경우에는 제한 없음이 된다.
   */
  startDate?: typia.Primitive<Date>;

  /**
   * 종료 날짜로, 없을 경우에는 제한 없음이 된다.
   */
  endDate?: typia.Primitive<Date>;
}
