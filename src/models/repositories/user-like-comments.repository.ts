import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserLikeCommentEntity } from '../tables/user-like-comment.entity';

@CustomRepository(UserLikeCommentEntity)
export class UserLikeCommentsRepository extends Repository<UserLikeCommentEntity> {}
