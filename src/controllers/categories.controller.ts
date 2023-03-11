import { TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { createPaginationForm } from '../interceptors/transform.interceptor';
import { SearchPaginationDto } from '../models/dtos/search-pagination.dto';
import { CategoriesService } from '../providers/categories.service';
import { CategoryType } from '../types';

@UseGuards(JwtGuard)
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * 카테고리를 조회하는 API로, 글 작성 시 카테고리 선택을 위해 사용한다.
   *
   * where, andWhere 식의 검색어를 중첩해나가면서 검색 대상을 좁히는 게 아니라,
   * 점점 늘려가는 식으로 구현된다.
   * 단, 중복이 발생해서는 안 된다.
   *
   * @param param0 검색어
   */
  @TypedRoute.Get()
  async findAll(@TypedQuery() paginationDto: SearchPaginationDto): Promise<CategoryType.FindAllResponse> {
    const response = await this.categoriesService.getAll(paginationDto);
    return createPaginationForm(response, paginationDto);
  }
}
