import { CommentEntity } from '../tables/comment.entity';

export interface CreateCommentDto
  extends Pick<CommentEntity, 'contents' | 'parentId' | 'imageId' | 'xPosition' | 'yPosition'> {}
