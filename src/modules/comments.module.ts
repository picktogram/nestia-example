import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '@root/config/typeorm/custom-typeorm.module';
import { CommentsRepository } from '@root/models/repositories/comments.repository';
import { CommentsService } from '@root/providers/comments.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CommentsRepository])],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
