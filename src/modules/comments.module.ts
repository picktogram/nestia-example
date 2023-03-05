import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { CommentsService } from '../providers/comments.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CommentsRepository, ArticlesRepository])],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
