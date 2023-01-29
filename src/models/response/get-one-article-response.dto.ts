import { ApiProperty, PickType } from '@nestjs/swagger';

import { Article } from '../tables/article';
import { BodyImage } from '../tables/bodyImage';
import { User } from '../tables/user';

export class GetWriterResponseDto extends PickType(User, ['id', 'nickname', 'profileImage'] as const) {}
export class GetBodyImageListResponseDto extends PickType(BodyImage, ['id', 'position', 'depth', 'url'] as const) {}
export class GetOneArticleResponseDto extends PickType(Article, ['id', 'contents'] as const) {
  @ApiProperty({ type: GetWriterResponseDto })
  writer: GetWriterResponseDto;

  @ApiProperty({ type: [GetBodyImageListResponseDto] })
  images: GetBodyImageListResponseDto[];

  constructor(metadata) {
    super();

    Object.assign(this, metadata);
  }
}
