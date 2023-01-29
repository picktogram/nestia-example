import { PickType } from '@nestjs/swagger';
import { Article } from '../tables/article';

export class createArticleDto extends PickType(Article, ['title']) {}
