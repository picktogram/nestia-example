import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserLikeArticleEntity } from '../tables/user-like-article.entity';

@CustomRepository(UserLikeArticleEntity)
export class UserLikeArticlesRepository extends Repository<UserLikeArticleEntity> {}
