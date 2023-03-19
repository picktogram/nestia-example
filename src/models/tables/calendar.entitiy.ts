import { Column, Entity } from 'typeorm';
import { CommonCloumns } from '../common/common-columns';

@Entity({ name: 'calendar' })
export class CalendarEntitiy extends CommonCloumns {
  /**
   * 서버를 통해 1일 날짜를 기준으로 데이터 받아온다.
   */
  @Column({ length: 2048 })
  eventDateRange!: string;
}
