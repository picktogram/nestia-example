import { Module } from '@nestjs/common';
import { CategoriesService } from '../providers/categories.service';
import { CategoriesController } from '../controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../models/tables/category';
import { ProductHasCategory } from '../models/tables/productHasCategory';

@Module({
  imports: [TypeOrmModule.forFeature([Category, ProductHasCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
