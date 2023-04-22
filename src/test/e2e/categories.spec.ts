import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import * as AuthApis from '../../api/functional/api/v1/auth';
import * as CategoryApis from '../../api/functional/api/v1/categories';
import { CategoryEntity } from '../../models/tables/category.entity';
import { after, describe, it, before } from 'node:test';
import assert from 'node:assert';

describe('E2E categories test', () => {
  const host = 'http://localhost:4000';
  let app: INestApplication;
  let testingModule: TestingModule;

  before(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(4000);
  });

  after(async () => {
    await app.close();
  });

  describe('GET api/v1/categories', { concurrency: true }, () => {
    let token: string = '';
    let categories: CategoryEntity[];
    before(async () => {
      /**
       * 로그인 절차
       */
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      token = response.data;

      /**
       * 테스트를 위해서 3개의 카테고리를 삽입
       */

      categories = await Promise.all(
        ['a1', 'b1', 'c1'].map(async (name) => {
          const isCreated = await CategoryEntity.findOneBy({ name });
          if (!isCreated) {
            return await CategoryEntity.save({ name });
          }
          return isCreated;
        }),
      );
    });

    it('카테고리를 조회한다.', async () => {
      const findAllResponse = await CategoryApis.findAll(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      assert.strictEqual(findAllResponse.data.list instanceof Array, true);
    });

    it('검색어를 기준으로 이름이 겹치는 카테고리를 조회한다.', async () => {
      const findAllResponse = await CategoryApis.findAll(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        { page: 1, limit: 10, search: 'a ' },
      );
      assert.strictEqual(findAllResponse.data.list instanceof Array, true);
      assert.strictEqual(findAllResponse.data.list.length, 1);
    });

    /**
     * where, andWhere 식의 검색어를 중첩해나가면서 검색 대상을 좁히는 게 아니라,
     * 점점 늘려가는 식으로 구현된다.
     * 단, 중복이 발생해서는 안 된다.
     */
    it('검색어가 있을 시, 검색어에 조금이라도 겹칠 모든 카테고리를 조회한다.', async () => {
      const findAllResponse = await CategoryApis.findAll(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        { page: 1, limit: 10, search: 'a b c' },
      );
      assert.strictEqual(findAllResponse.data.list instanceof Array, true);
      assert.strictEqual(findAllResponse.data.list.length, categories.length);
      assert.strictEqual(findAllResponse.data.list.length, 3);
    });
  });
});
