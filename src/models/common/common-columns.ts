import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TimeColumns } from './time-columns';

export class CommonCloumns extends TimeColumns {
  @ApiProperty({ description: 'id', example: 1 })
  @PrimaryGeneratedColumn()
  public readonly id: number;
}
