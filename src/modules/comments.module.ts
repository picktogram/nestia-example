import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { BodyImagesRepository } from '../models/repositories/body-images.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { UserLikeCommentsRepository } from '../models/repositories/user-like-comments.repository';
import { CommentsService } from '../providers/comments.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      CommentsRepository,
      ArticlesRepository,
      UserLikeCommentsRepository,
      BodyImagesRepository,
    ]),
  ],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
