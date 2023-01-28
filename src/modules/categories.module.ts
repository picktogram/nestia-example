import { Module } from '@nestjs/common';
import { CategoriesService } from '../providers/categories.service';
import { CategoriesController } from '../controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../models/tables/category';
import { ArticleHasCategory } from '../models/tables/articleHasCategory';

@Module({
  imports: [TypeOrmModule.forFeature([Category, ArticleHasCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
