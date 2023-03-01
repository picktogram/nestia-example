import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as AuthApis from '../../../packages/api/lib/dist/api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';

describe('E2E article test', () => {
  const host = 'http://localhost:3000';
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('auth API test', () => {
    it('should return an array of articles', async () => {
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, typia.random<CreateUserDto>());
      const createdUser = signUpResponse.data;

      expect(createdUser.id).toBeDefined();
    });
  });
});
