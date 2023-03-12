import { Module } from '@nestjs/common';
import { ArticlesService } from '../providers/articles.service';
import { ArticlesController } from '../controllers/articles.controller';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { CommentsModule } from './comments.module';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import { ReportArticlesRepository } from '../models/repositories/report-articles.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      ArticlesRepository,
      CommentsRepository,
      UserBridgesRepository,
      ReportArticlesRepository,
    ]),
    CommentsModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
