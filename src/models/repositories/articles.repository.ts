import { CustomRepository } from '@root/config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { Article } from '../tables/article';

@CustomRepository(Article)
export class ArticlesRepository extends Repository<Article> {}
