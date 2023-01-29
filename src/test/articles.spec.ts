import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../models/tables/article';
import { TypeOrmModuleOptions } from '../config/typeorm';
import { ArticlesController } from '../controllers/articles.controller';
import { ArticlesService } from '../providers/articles.service';
import { ArticlesModule } from '../modules/articles.module';

describe('Article Entity', () => {
  let controller: ArticlesController;
  let service: ArticlesService;
  let article;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([Article]),
        ConfigModule.forRoot({ isGlobal: true }),
        ArticlesModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    controller = module.get<ArticlesController>(ArticlesController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it.only('0-1. Service와 Controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });
});
