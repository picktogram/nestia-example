import { Controller } from '@nestjs/common';
import { CategoriesService } from '../providers/categories.service';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
}
