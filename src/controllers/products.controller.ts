import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../providers/products.service';

@ApiTags('상품 / Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'MVP : 상품의 상세 내역을 조회' })
  @ApiParam({ name: 'id', description: 'productId' })
  @Get('id')
  async getDetail(@Param('id', ParseIntPipe) productId: number) {
    return await this.productsService.getDetail(productId);
  }
}
