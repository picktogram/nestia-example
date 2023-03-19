import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../models/tables/category.entity';
import { TypeOrmModuleOptions } from '../../config/typeorm';
import { CategoriesController } from '../../controllers/categories.controller';
import { CategoriesService } from '../../providers/categories.service';
import { CategoriesModule } from '../../modules/categories.module';

describe('CategoryEntity Entity', () => {
  let controller: CategoriesController;
  let service: CategoriesService;
  let category;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([CategoryEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
        CategoriesModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it.only('0-1. Service와 Controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });
});
