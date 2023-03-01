import { ArticleEntity } from '../tables/article.entity';
import { CreateRootBodyImageDto } from './create-body-image.dto';

export interface CreateArticleDto extends Pick<ArticleEntity, 'contents' | 'type'> {
  /**
   * @maxItems 10
   */
  images?: CreateRootBodyImageDto[];
}
