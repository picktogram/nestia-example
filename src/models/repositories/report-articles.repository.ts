import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { ReportArticleEntity } from '../tables/report-article.entity';

@CustomRepository(ReportArticleEntity)
export class ReportArticlesRepository extends Repository<ReportArticleEntity> {}
