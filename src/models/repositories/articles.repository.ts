import { EntityRepository, Repository } from 'typeorm';
import { Article } from '../tables/article';

@EntityRepository(Article)
export class ArticlesRepository extends Repository<Article> {}
