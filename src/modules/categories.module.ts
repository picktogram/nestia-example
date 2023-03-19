import { Module } from '@nestjs/common';
import { CategoriesService } from '../providers/categories.service';
import { CategoriesController } from '../controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/tables/category.entity';
import { ArticleHasCategoryEntity } from '../models/tables/article-has-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ArticleHasCategoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
