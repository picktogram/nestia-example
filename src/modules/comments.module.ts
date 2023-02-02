import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '@root/config/typeorm/custom-typeorm.module';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { CommentsRepository } from '@root/models/repositories/comments.repository';
import { CommentsService } from '@root/providers/comments.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CommentsRepository, ArticlesRepository])],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
