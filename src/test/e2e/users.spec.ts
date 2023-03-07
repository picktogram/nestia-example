import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as UserApis from '../../api/functional/api/v1/users';
import * as AuthApis from '../../api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';

describe('E2E users test', () => {
  const host = 'http://localhost:4000';
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(4000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET api/v1/users/profile', () => {
    let token: string = '';
    beforeAll(async () => {
      const disigner = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, disigner);
      const response = await AuthApis.login({ host }, disigner);
      token = response.data;
    });

    it('디자이너가 회원 가입 후 자신의 프로필을 조회하는 시나리오', async () => {
      const profile = await UserApis.profile.getProfile({
        host,
        headers: {
          Authorization: token,
        },
      });

      expect(profile).toBeDefined();
    });
  });

  describe('POST api/v1/users/:id/follow', () => {
    let token: string = '';
    beforeAll(async () => {
      const disigner = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, disigner);
      const response = await AuthApis.login({ host }, disigner);
      token = response.data;
    });

    it('디자이너가 다른 사람을 팔로우하는 경우에 대한 테스트', async () => {
      // NOTE : 팔로우할 다른 디자이너 생성
      const userData = typia.random<CreateUserDto>();
      const follower = await AuthApis.sign_up.signUp({ host }, userData);

      const response = await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        follower.data.id,
      );

      expect(response.data).toBe(true);
    });
  });

  /**
   * 알 수도 있는 사람을 조회하는 API
   */
  describe('GET api/v1/users/acquaintance', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 유저의 평판 조회하기 API
   * 가리키는 아이디가 내 id일 경우, 내 평판 조회하는 것과 동일하게 된다.
   */
  describe('GET api/v1/uesrs/:id/reputation', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });
});
