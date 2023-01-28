import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../models/tables/product';
import { TypeOrmModuleOptions } from '../config/typeorm';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../providers/products.service';
import { ProductsModule } from '../modules/products.module';

describe('Product Entity', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let product;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([Product]),
        ConfigModule.forRoot({ isGlobal: true }),
        ProductsModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    controller = module.get<ProductsController>(ProductsController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it.only('0-1. Service와 Controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });
});
