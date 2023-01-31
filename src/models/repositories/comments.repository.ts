import { CustomRepository } from '@root/config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { Comment } from '../tables/comment';

@CustomRepository(Comment)
export class CommentsRepository extends Repository<Comment> {}
