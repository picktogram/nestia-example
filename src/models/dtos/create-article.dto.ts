import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsOptional, ValidateNested } from 'class-validator';
import { ArticleEntity } from '../tables/article.entity';
import { CreateRootBodyImageDto } from './create-body-image.dto';

export class CreateArticleDto extends PickType(ArticleEntity, ['contents']) {
  @ApiProperty({ type: [CreateRootBodyImageDto], required: false })
  @Type(() => CreateRootBodyImageDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @ArrayMaxSize(10)
  images: CreateRootBodyImageDto[] = [];
}
