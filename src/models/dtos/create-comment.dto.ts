import { PickType } from '@nestjs/swagger';
import { Comment } from '../tables/comment';

export class CreateCommentDto extends PickType(Comment, ['contents']) {}
