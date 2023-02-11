import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '../tables/comment.entity';

export class CreateCommentDto extends PickType(CommentEntity, [
  'contents',
  'parentId',
  'xPosition',
  'yPosition',
] as const) {}
