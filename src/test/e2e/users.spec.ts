import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as UserApis from '../../api/functional/api/v1/users';
import * as AuthApis from '../../api/functional/api/v1/auth';
import * as ArticleApis from '../../api/functional/api/v1/articles';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { DecodedUserToken } from '../../models/tables/user.entity';
import { Try } from '../../types';
import { CreateArticleDto } from '../../models/dtos/create-article.dto';
import { isBusinessErrorGuard, isErrorGuard } from '../../config/errors';
import { IConnection } from '@nestia/fetcher';
import { describe, it, after, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import { UserBridgeEntity } from '../../models/tables/user-bridge.entity';

describe('E2E users test', () => {
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

  describe('PUT api/v1/users/profile', { concurrency: false }, () => {
    let connection: IConnection;
    before(async () => {
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      connection = {
        host,
        headers: {
          Authorization: response.data,
        },
      };
    });

    it('커버 이미지를 수정하는 기능을 테스트', async () => {
      const before = await UserApis.profile.getProfile(connection);
      await UserApis.profile.updateProfile(connection, { coverImage: 'test.jpg' });
      const after = await UserApis.profile.getProfile(connection);

      if (isBusinessErrorGuard(before) || isBusinessErrorGuard(after)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(before.data.coverImage, null);
      assert.strictEqual(after.data.coverImage, 'test.jpg');
    });

    it('프로필 이미지를 수정하는 기능을 테스트', async () => {
      const before = await UserApis.profile.getProfile(connection);
      await UserApis.profile.updateProfile(connection, { profileImage: 'test.jpg' });
      const after = await UserApis.profile.getProfile(connection);

      if (isBusinessErrorGuard(before) || isBusinessErrorGuard(after)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(before.data.profileImage, null);
      assert.strictEqual(after.data.profileImage, 'test.jpg');
    });

    it('소개글 수정을 테스트', async () => {
      const before = await UserApis.profile.getProfile(connection);
      const res = await UserApis.profile.updateProfile(connection, { introduce: 'test.jpg' });
      const after = await UserApis.profile.getProfile(connection);
      if (isBusinessErrorGuard(before) || isBusinessErrorGuard(after)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(before.data.introduce, null);
      assert.strictEqual(after.data.introduce, 'test.jpg');
    });
  });

  /**
   * 이미지 업로드
   */
  describe('POST api/v1/users/profile/cover', { concurrency: false }, () => {
    let connection: IConnection;
    before(async () => {
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      connection = {
        host,
        headers: {
          Authorization: response.data,
        },
      };
    });

    /**
     * 이미지 업로드 같은 경우는 nestia로는 불가능하기 때문에 추후에 하는 것으로.
     */
    it('프로필의 커버 이미지를 업로드하는 기능을 테스트', { todo: true });

    it('이미지가 없을 경우에 대한 예외 처리', async () => {
      const uploadCoverImageResponse = await UserApis.profile.cover_image.uploadCoverImage(connection);
      if (!isBusinessErrorGuard(uploadCoverImageResponse)) {
        assert.strictEqual(1, 2);
        return;
      }
      assert.strictEqual(uploadCoverImageResponse.data, '적어도 1장 이상의 이미지를 골라야 합니다.');
    });
  });

  describe('GET api/v1/users/profile', { concurrency: false }, () => {
    let token: string = '';
    before(async () => {
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

      assert.notStrictEqual(profile, undefined);
    });

    it('디자이너 프로필 조회 시 프로필 이미지가 나와야 한다.', async () => {
      const profile = await UserApis.profile.getProfile({
        host,
        headers: {
          Authorization: token,
        },
      });

      if (isBusinessErrorGuard(profile)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.notStrictEqual(profile, undefined);
      assert.notStrictEqual(Object.keys(profile.data).includes('profileImage'), undefined);
    });

    it('디자이너 프로필 조회 시 프로필 이미지가 나와야 한다.', async () => {
      const profile = await UserApis.profile.getProfile({
        host,
        headers: {
          Authorization: token,
        },
      });

      if (isBusinessErrorGuard(profile)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.notStrictEqual(profile, undefined);
      assert.notStrictEqual(Object.keys(profile.data).includes('coverImage'), undefined);
    });

    it('토큰을 decode할 게 아니라, 업데이트된 이후의 최신 정보를 반환해야 한다.', { todo: true });
  });

  /**
   * 다른 디자이너를 조회
   */
  describe('GET api/v1/users/:id', { concurrency: false }, () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;

    let otherDesignerToken: string = '';
    let otherDesignerDecodedToken: DecodedUserToken;
    let connection: IConnection;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      if (isBusinessErrorGuard(signUpResponse)) {
        return false;
      }

      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
      token = response.data;
      connection = {
        host,
        headers: {
          Authorization: token,
        },
      };

      /**
       * 조회할 대상을 추가
       */
      const otherDesigner = typia.random<CreateUserDto>();
      const otherDesignerSignUpResponse = await AuthApis.sign_up.signUp({ host }, otherDesigner);
      if (isBusinessErrorGuard(otherDesignerSignUpResponse)) {
        return false;
      }

      otherDesignerDecodedToken = otherDesignerSignUpResponse.data;
      const otherDesignerLoginResponse = await AuthApis.login({ host }, otherDesigner);
      otherDesignerToken = otherDesignerLoginResponse.data;
    });

    it.todo('조회에 성공해야 한다.');

    it('다른 디자이너 조회 시, 서로 팔로우하지 않은 경우 nothing 상태 값이 나와야 한다.', async () => {
      const response = await UserApis.getDetailProdfile(connection, otherDesignerDecodedToken.id);
      if (isErrorGuard(response)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(response.data.followStatus === 'nothing', true);
    });

    it('다른 디자이너 조회 시, 팔로우한 경우 follow 상태가 나와야 한다.', async () => {
      await UserApis.follow.follow(connection, otherDesignerDecodedToken.id);
      const response = await UserApis.getDetailProdfile(connection, otherDesignerDecodedToken.id);
      if (isErrorGuard(response)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(response.data.followStatus === 'follow', true);
    });

    it('다른 디자이너 조회 시, 맞팔로우한 경우 followUp 상태가 나와야 한다.', async () => {
      /**
       * 팔로우 후 맞 팔로우를 당했다고 가정한다.
       */
      await UserApis.follow.follow(connection, otherDesignerDecodedToken.id);
      await UserApis.follow.follow(
        {
          host,
          headers: {
            authorization: otherDesignerToken,
          },
        },
        decodedToken.id,
      );
      const response = await UserApis.getDetailProdfile(connection, otherDesignerDecodedToken.id);

      if (isErrorGuard(response)) {
        assert.strictEqual(1, 2);
        return;
      }

      const first = await UserBridgeEntity.findOne({ where: { firstUserId: decodedToken.id } });
      const second = await UserBridgeEntity.findOne({ where: { secondUserId: otherDesignerDecodedToken.id } });
      assert.notStrictEqual(first, null);
      assert.notStrictEqual(second, null);

      assert.strictEqual(response.data.followStatus === 'followUp', true);
    });

    /**
     * 프로필 조회를 유저 조회로 합치면서, 자기 자신을 구분하기 위한 프로퍼티를 추가
     */
    it('자기 자신을 조회한 경우, myself이 true로 나오며 followStatus는 nothing이어야 한다.', async () => {
      const response = await UserApis.getDetailProdfile(connection, decodedToken.id);
      if (isErrorGuard(response)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(response.data.myself, true);
      assert.strictEqual(response.data.followStatus === 'nothing', true);
    });

    it('다른 디자이너 조회 시, 나를 조회한 사람인 경우 reverse 상태가 나와야 한다.', async () => {
      await UserApis.follow.follow(
        {
          host,
          headers: {
            authorization: otherDesignerToken,
          },
        },
        decodedToken.id,
      );
      const response = await UserApis.getDetailProdfile(connection, otherDesignerDecodedToken.id);

      if (isErrorGuard(response)) {
        assert.strictEqual(1, 2);
        return;
      }

      assert.strictEqual(response.data.followStatus === 'reverse', true);
    });
  });

  describe('POST api/v1/users/:id/follow', { concurrency: false }, () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      if (isBusinessErrorGuard(signUpResponse)) {
        return false;
      }

      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('디자이너가 다른 사람을 팔로우하는 경우에 대한 테스트', async () => {
      // NOTE : 팔로우할 다른 디자이너 생성
      const userData = typia.random<CreateUserDto>();
      const follower = await AuthApis.sign_up.signUp({ host }, userData);

      if (isBusinessErrorGuard(follower)) {
        assert.strictEqual(1, 2);
        return;
      }

      const response = await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        follower.data.id,
      );

      if (response.code === 1000) {
        response.data;
      } else if (response.code === 4008) {
        response.data;
      } else {
        // 아직 명시되지 않았지만 에러가 추가될 수 있다.
        response.data;
      }

      assert.strictEqual(response.data, true);
    });

    /**
     * 단 회원 가입 시 이미 자기 자신을 팔로우한 상태로 되어 있다.
     */
    it('나 자신을 팔로우하는 것은 불가능하다.', async () => {
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

      assert.strictEqual(response.code, 4017);
    });

    /**
     * @link {https://github.com/picktogram/server/issues/10}
     */
    describe('#issue 10. followStatus 갱신 에러', { concurrency: false }, () => {
      let writerToken: string = '';
      let decodedWriterToken: DecodedUserToken;

      let token: string = '';
      let decodedToken: DecodedUserToken;
      beforeEach(async () => {
        /**
         * 글을 작성할 사람으로, 팔로우 전 후로 게시글의 팔로우 상태 조회에 사용한다.
         */
        const writer = typia.random<CreateUserDto>();
        const writerSignUpResponse = await AuthApis.sign_up.signUp({ host }, writer);
        if (isBusinessErrorGuard(writerSignUpResponse)) {
          assert.strictEqual(1, 2);
          return;
        }

        decodedWriterToken = writerSignUpResponse.data;

        const writerLoginResponse = await AuthApis.login({ host }, writer);
        writerToken = writerLoginResponse.data;

        /**
         * 팔로우 전후 글을 조회할 사람
         */
        const designer = typia.random<CreateUserDto>();
        const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
        if (isBusinessErrorGuard(signUpResponse)) {
          assert.strictEqual(1, 2);
          return;
        }
        decodedToken = signUpResponse.data;

        const designerLoginResponse = await AuthApis.login({ host }, designer);
        token = designerLoginResponse.data;
      });

      it('follow api 성공 메시지를 확인한 후에 게시글 리스트 조회 시 followStatus 갱신', async () => {
        const dummyWriting = typia.random<CreateArticleDto>();
        const writeArticleResponse = await ArticleApis.writeArticle(
          {
            host,
            headers: {
              Authorization: writerToken,
            },
          },
          { contents: dummyWriting.contents, type: 'writing' },
        );

        const before = await ArticleApis.getAllArticles(
          {
            host,
            headers: {
              Authorization: token,
            },
          },
          { page: 1, limit: 1 },
        );

        await UserApis.follow.follow(
          {
            host,
            headers: {
              Authorization: token,
            },
          },
          decodedWriterToken.id,
        );

        const after = await ArticleApis.getAllArticles(
          {
            host,
            headers: {
              Authorization: token,
            },
          },
          { page: 1, limit: 1 },
        );

        assert.strictEqual(
          before.data.list.some((el) => el.writer.followStatus !== 'nothing'),
          false,
        );
        const articleBeforeFollow = before.data.list.find(
          (el) => writeArticleResponse.code === 1000 && el.id === writeArticleResponse.data.id,
        );
        assert.strictEqual(articleBeforeFollow?.writer.followStatus === 'nothing', true);

        assert.strictEqual(
          after.data.list.some((el) => el.writer.followStatus !== 'nothing'),
          true,
        );
        const articleAfterFollow = after.data.list.find(
          (el) => writeArticleResponse.code === 1000 && el.id === writeArticleResponse.data.id,
        );
        assert.strictEqual(articleAfterFollow?.writer.followStatus === 'nothing', false);
      });
    });
  });

  /**
   * 알 수도 있는 사람을 조회하는 API
   */
  describe('GET api/v1/users/acquaintance', { concurrency: false }, () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      if (isBusinessErrorGuard(signUpResponse)) {
        return;
      }

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

      assert.notStrictEqual(response.data.list, undefined);
      assert.strictEqual(response.data.list.length, 0);
    });

    it('팔로우를 당한 경우, 나를 팔로우한 상대가 추천 목록에 조회되어야 한다.', async () => {
      // NOTE : 나를 팔로우할 대상을 생성
      const userData = typia.random<CreateUserDto>();
      const followee = await AuthApis.sign_up.signUp({ host }, userData);
      if (isBusinessErrorGuard(followee)) {
        assert.strictEqual(1, 2);
        return;
      }

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

      assert.notStrictEqual(response.data.list, undefined);
      assert.notStrictEqual(response.data.list.length, 0);

      /**
       * 자기 자신이 추천 목록에 나와서는 안 된다.
       */
      assert.strictEqual(
        response.data.list.some((el) => el.id === decodedToken.id),
        false,
      );

      /**
       * 상대는 추천 목록에 있어야 한다.
       */
      assert.strictEqual(
        response.data.list.some((el) => el.id === followee.data.id),
        true,
      );
    });

    /**
     * 해당 로직에 문제가 있는 것으로 보인다.
     */
    it('역으로 나도 팔로우를 하여, 서로 맞팔 상태가 되었을 때 친구 추천 목록에서 나오지 말아야 한다.', async () => {
      // NOTE : 나를 팔로우할 대상을 생성
      const userData = typia.random<CreateUserDto>();
      const followee = await AuthApis.sign_up.signUp({ host }, userData);
      if (isBusinessErrorGuard(followee)) {
        assert.strictEqual(1, 2);
        return;
      }

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

      // NOTE : 나도 맞팔로우한다.
      await UserApis.follow.follow(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        followee.data.id,
      );

      // NOTE : 내 기준으로 조회할 때, 상대가 친구 추천 목록에 나오는지 확인한다.
      const response = await UserApis.acquaintance.getAcquaintance(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      assert.notStrictEqual(response.data.list, undefined);
      assert.strictEqual(response.data.list.length, 0);

      /**
       * 내가 조회한 친구 목록에서 먼저 팔로우해줬던 사람 (followee)이 있으면 안 된다.
       */
      assert.strictEqual(
        response.data.list.some((el) => el.id === followee.data.id),
        false,
      );
    });

    it('나 자신은 친구 추천 목록에서 나와서는 안 된다.', async () => {
      const acquaintance = await UserApis.acquaintance.getAcquaintance(
        { host, headers: { Authorization: token } },
        { limit: 100, page: 1 },
      );

      const isIncludeMySelf = acquaintance.data.list.every((el) => el.id !== decodedToken.id);
      assert.strictEqual(isIncludeMySelf, true);
    });

    /**
     * 유명인의 기준은 팔로우가 100명 이상인 사람이다.
     */
    it('유명인들을 추천해주어야 하며, 사유를 말해야 한다.', { todo: true });
    it(
      '내가 좋아요를 누른 게시글과 댓글이 우연히 n 번 이상 동일 인물인 경우 추천해주며, 사유를 말해줘야 한다.',
      {
        todo: true,
      },
      async () => {
        // 나를 팔로우한 사람이 있다면 친구 추천 목록에서 나와야 한다.

        // NOTE : 나를 팔로우할 대상을 생성
        const userData = typia.random<CreateUserDto>();
        const followee = await AuthApis.sign_up.signUp({ host }, userData);
        if (isBusinessErrorGuard(followee)) {
          assert.strictEqual(1, 2);
          return;
        }

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

        // NOTE : 내 기준으로 조회할 때, 상대가 친구 추천 목록에 나오는지 확인한다.
        const response = await UserApis.acquaintance.getAcquaintance(
          {
            host,
            headers: {
              Authorization: token,
            },
          },
          { page: 1, limit: 10 },
        );

        assert.notStrictEqual(response.data.list, undefined);
        assert.notStrictEqual(response.data.list.length, 0);

        /**
         * 내가 조회한 친구 목록에서 먼저 팔로우해줬던 사람 (followee)이 있어야 한다.
         */
        assert.strictEqual(
          response.data.list.some((el) => el.id === followee.data.id),
          true,
        );

        assert.strictEqual(
          response.data.list.every((profile) => profile.reason),
          true,
        );
      },
    );
  });

  describe('GET api/v1/users/:id/follwers', { concurrency: false }, () => {
    it('해당 유저가 팔로우한 사람들이 조회된다.', { todo: true });

    /**
     * 팔로우 자체를 못하게 막을 것이지만, 더 방어적으로 프로그래밍한다.
     */
    it('해당 유저가 팔로워 목록에서 조회되서는 안 된다.', { todo: true });
  });

  describe('GET api/v1/users/:id/followee', { concurrency: false }, () => {
    it('해당 유저를 팔로이한 사람들이 조회된다.', { todo: true });

    /**
     * 팔로우 자체를 못하게 막을 것이지만, 더 방어적으로 프로그래밍한다.
     */
    it('해당 유저가 팔로이 목록에서 조회되서는 안 된다.', { todo: true });
  });

  /**
   * 유저의 평판 조회하기 API
   * 가리키는 아이디가 내 id일 경우, 내 평판 조회하는 것과 동일하게 된다.
   */
  describe('GET api/v1/uesrs/:id/reputation', { concurrency: false }, () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      if (isBusinessErrorGuard(signUpResponse)) {
        assert.strictEqual(1, 2);
        return;
      }

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

      assert.notStrictEqual(myReputation.data, undefined);
    });

    it('조회한 유저가 자기 자신일 경우에는 그걸 의미하는 값을 전달해야 한다.', { todo: true });
  });

  /**
   * 유저가 다른 유저를 언팔로우하는 상황
   */
  describe('DELETE api/v1/users/:id/follow', { concurrency: false }, () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;

    let userToBeFollowed: Try<DecodedUserToken>;

    beforeEach(async () => {
      // NOTE : 팔로우를 하는 쪽
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      if (isBusinessErrorGuard(signUpResponse)) {
        assert.strictEqual(1, 2);
        return;
      }

      decodedToken = signUpResponse.data;

      // NOTE : 팔로우하는 쪽에서는 로그인까지 진행
      const response = await AuthApis.login({ host }, designer);
      token = response.data;

      // NOTE : 팔로우를 당하는 쪽
      const designer2 = typia.random<CreateUserDto>();
      const followerSignUpResponse = await AuthApis.sign_up.signUp({ host }, designer2);
      if (isBusinessErrorGuard(followerSignUpResponse)) {
        assert.strictEqual(1, 2);
        return;
      }

      userToBeFollowed = followerSignUpResponse;

      /**
       * NOTE : 언팔로우를 테스트하기 위해 팔로우를 미리 걸어놓는다.
       */
      const followResponse = await UserApis.follow.follow(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        userToBeFollowed.data.id,
      );
    });

    it('유저가 언팔로우에 성공한다.', async () => {
      const unfollowResponse = await UserApis.follow.unfollow(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        userToBeFollowed.data.id,
      );

      assert.notStrictEqual(unfollowResponse.data, undefined);
    });
  });
});
