import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserLikeArticleEntity } from '../tables/userLikeArticle.entity';

@CustomRepository(UserLikeArticleEntity)
export class UserLikeArticlesRepository extends Repository<UserLikeArticleEntity> {}
