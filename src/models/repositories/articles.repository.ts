import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../tables/article.entity';

@CustomRepository(ArticleEntity)
export class ArticlesRepository extends Repository<ArticleEntity> {}
