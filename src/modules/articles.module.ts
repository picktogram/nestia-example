import { Module } from '@nestjs/common';
import { ArticlesService } from '../providers/articles.service';
import { ArticlesController } from '../controllers/articles.controller';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { CustomTypeOrmModule } from '@root/config/typeorm/custom-typeorm.module';
import { CommentsModule } from './comments.module';
import { CommentsRepository } from '@root/models/repositories/comments.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ArticlesRepository, CommentsRepository]), CommentsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
