import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/tables/user';
import { TypeOrmModuleOptions } from '../config/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '@root/auth/auth.controller';

describe('Auth Entity', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it.only('0-1. controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
    });
  });
});
