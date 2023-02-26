import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { CommentEntity } from '../tables/comment.entity';

@CustomRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {}
