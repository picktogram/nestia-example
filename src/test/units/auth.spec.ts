import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../models/tables/user.entity';
import { TypeOrmModuleOptions } from '../../config/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from '../../auth/auth.controller';
import { describe, it, before } from 'node:test';

import assert from 'node:assert';

describe('Auth Entity', () => {
  let controller: AuthController;

  before(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([UserEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it('0-1. controller 가 정의되어야 합니다.', async () => {
      assert.notStrictEqual(controller, undefined);
    });
  });

  it('test', async () => {
    assert.ok(true);
  });
});
