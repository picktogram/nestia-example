import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../providers/categories.service';
import { Category } from '../models/tables/category';

@ApiTags('카테고리 / Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'MVP : 카테고리 별 상품 조회' })
  @ApiParam({ name: 'id', description: 'categoryId' })
  @Get(':id/products')
  async getProductsBy(
    @Param('id', ParseIntPipe) categoryId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.categoriesService.getProductsBy(categoryId, page);
  }

  @ApiOperation({ summary: "MVP : 생성된 '모든' 카테고리 조회" })
  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoriesService.getAll();
  }
}
