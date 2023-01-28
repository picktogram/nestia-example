import { Module } from '@nestjs/common';
import { ArticlesService } from '../providers/articles.service';
import { ArticlesController } from '../controllers/articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticlesRepository])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
