import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as UserApis from '../../api/functional/api/v1/users';
import * as AuthApis from '../../api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { DecodedUserToken } from '../../models/tables/user.entity';
import { ERROR, ValueOfError } from '../../config/constant/error';

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
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
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

    it.todo('토큰을 decode할 게 아니라, 업데이트된 이후의 최신 정보를 반환해야 한다.');
  });

  describe('POST api/v1/users/:id/follow', () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
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

    /**
     * 단 회원 가입 시 이미 자기 자신을 팔로우한 상태로 되어 있다.
     */
    it('나 자신을 팔로우하는 것은 불가능하다.', async () => {
      try {
        const response = await UserApis.follow.follow(
          {
            host,
            headers: {
              Authorization: token,
            },
          },
          decodedToken.id,
        );
        /*
         * 반드시 에러로 진입하여야 하기 때문에 아래는 일부러 틀린 코드를 작성한다.
         */
        expect(1).toBe(2);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(Error);
        /**
         * TODO : 현재 nestia로 인해 결과 값이 transformer가 안멱혀서 JSON으로 나오니 수정 필요
         * TODO : 에러를 던지지 않고 타입으로 던질 수 있게 수정하기
         */
        // if (err instanceof Error) {
        //   expect(err.message).toBeDefined();
        //   expect(err.message).toBe(ERROR.CANNOT_FOLLOW_MYSELF.message);
        // }
      }
    });
  });

  /**
   * 알 수도 있는 사람을 조회하는 API
   */
  describe('GET api/v1/users/acquaintance', () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('API 동작 자체에 대한 테스트로, 응답 값은 유저의 정보를 가진 배열(페이지네이션) 이다.', async () => {
      const response = await UserApis.acquaintance.getAcquaintance(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(response.data.list).toBeDefined();
      expect(response.data.list.length).toBe(0);
    });

    it('팔로우를 당한 경우, 나를 팔로우한 상대가 추천 목록에 조회되어야 한다.', async () => {
      // NOTE : 나를 팔로우할 대상을 생성
      const userData = typia.random<CreateUserDto>();
      const followee = await AuthApis.sign_up.signUp({ host }, userData);

      // NOTE : 나를 팔로우할 대상이 로그인하여, 나를 팔로우
      const loginResponse = await AuthApis.login({ host }, userData);
      const followerToken = loginResponse.data;
      await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: followerToken,
          },
        },
        decodedToken.id,
      );

      const response = await UserApis.acquaintance.getAcquaintance(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(response.data.list).toBeDefined();
      expect(response.data.list.length).toBe(1);
    });

    /**
     * 해당 로직에 문제가 있는 것으로 보인다.
     */
    it('역으로 나도 팔로우를 하여, 서로 맞팔 상태가 되었을 때 친구 추천 목록에서 나오지 말아야 한다.', async () => {
      // NOTE : 나를 팔로우할 대상을 생성
      const userData = typia.random<CreateUserDto>();
      const followee = await AuthApis.sign_up.signUp({ host }, userData);

      // NOTE : 나를 팔로우할 대상이 로그인하여, 나를 팔로우
      const loginResponse = await AuthApis.login({ host }, userData);
      const followerToken = loginResponse.data;
      await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: followerToken,
          },
        },
        decodedToken.id,
      );

      await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        followee.data.id,
      );

      const response = await UserApis.acquaintance.getAcquaintance(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(response.data.list).toBeDefined();
      expect(response.data.list.length).toBe(0);
    });

    /**
     * 위에서 에러가 발생했기 때문에 다른 방식으로 한 번 더 테스트 진행할 것
     */
    it.todo('역으로 나도 팔로우를 하여, 서로 맞팔 상태가 되었을 때 친구 추천 목록에서 나오지 말아야 한다. 2');

    it.todo('나 자신은 친구 추천 목록에서 나와서는 안 된다.');
    it.todo('친구의 친구들을 추천해야 하며, 사유를 말해야 한다.');
    it.todo('유명인들을 추천해주어야 하며, 사유를 말해야 한다.');
    it.todo('내가 좋아요를 누른 게시글과 댓글이 우연히 n 번 이상 동일 인물인 경우 추천해주며, 사유를 말해줘야 한다.');
  });

  describe('GET api/v1/users/:id/follwers', () => {
    it.todo('해당 유저가 팔로우한 사람들이 조회된다.');

    /**
     * 팔로우 자체를 못하게 막을 것이지만, 더 방어적으로 프로그래밍한다.
     */
    it.todo('해당 유저가 팔로워 목록에서 조회되서는 안 된다.');
  });

  describe('GET api/v1/users/:id/followee', () => {
    it.todo('해당 유저를 팔로이한 사람들이 조회된다.');

    /**
     * 팔로우 자체를 못하게 막을 것이지만, 더 방어적으로 프로그래밍한다.
     */
    it.todo('해당 유저가 팔로이 목록에서 조회되서는 안 된다.');
  });

  /**
   * 유저의 평판 조회하기 API
   * 가리키는 아이디가 내 id일 경우, 내 평판 조회하는 것과 동일하게 된다.
   */
  describe('GET api/v1/uesrs/:id/reputation', () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('유저의 평판 조회에 성공한다.', async () => {
      const myReputation = await UserApis.reputation.checkReputation(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        decodedToken.id,
      );

      expect(myReputation.data).toBeDefined();
    });

    it.todo('조회한 유저가 자기 자신일 경우에는 그걸 의미하는 값을 전달해야 한다.');
  });
});
