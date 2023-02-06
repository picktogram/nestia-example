import { ApiProperty, PickType } from '@nestjs/swagger';

import { ArticleEntity } from '../tables/article.entity';
import { BodyImageEntity } from '../tables/bodyImage.entity';
import { UserEntity } from '../tables/user.entity';

export class GetWriterResponseDto extends PickType(UserEntity, ['id', 'nickname', 'profileImage'] as const) {}
export class GetBodyImageListResponseDto extends PickType(BodyImageEntity, [
  'id',
  'position',
  'depth',
  'url',
] as const) {}
export class GetOneArticleResponseDto extends PickType(ArticleEntity, ['id', 'contents'] as const) {
  @ApiProperty({ type: GetWriterResponseDto })
  writer: GetWriterResponseDto;

  @ApiProperty({ type: [GetBodyImageListResponseDto] })
  images: GetBodyImageListResponseDto[];

  constructor(metadata) {
    super();

    Object.assign(this, metadata);
  }
}
