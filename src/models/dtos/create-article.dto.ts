import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Article } from '../tables/article';
import { CreateRootBodyImageDto } from './create-body-image.dto';

export class CreateArticleDto extends PickType(Article, ['contents']) {
  @ApiProperty({ type: [CreateRootBodyImageDto], required: false })
  @Type(() => CreateRootBodyImageDto)
  @ValidateNested({ each: true })
  @IsOptional()
  images: CreateRootBodyImageDto[] = [];
}
