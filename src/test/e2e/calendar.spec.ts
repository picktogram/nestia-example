import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import { describe, it, after, before, beforeEach } from 'node:test';
import typia from 'typia';

describe('E2E calendar test', () => {
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

  /**
   * 캘린더를 조회한다.
   */
  describe('GET api/v1/calendar', { concurrency: true }, () => {
    beforeEach(async () => {
      // 캘린더 API를 쓸 가상의 유저를 회원가입, 로그인해놓고, 토큰을 저장해둘 것
    });

    it('캘린더에는 내가 팔로우한 사람들의 생일이 조회되어야 한다.', async () => {
      // 팔로우 당할 사람을 생성 ( 생일은 내가 미리 지정한 임의의 날짜 )
      // 팔로우 당할 사람을, 팔로우
      // 내 친구 조회
      // 팔로우가 있는 것 확인 완료
      // 캘린더 API 호출하여 그 사람의 생일이 나오나 테스트
      // const response = CalendarApis.get({host, headers}, {});
      // expect(response.data.list).toBeInstanceOf(Array);
      // expect(response.data.list.find((el) => el.userId === 방금만든유저.id).birth.toString()).toBe(생일.toString());
    });

    it('캘린더에는 내 생일도 표기되야 하며, 내 생일은 더욱 "특별히" 표현되어야 한다.', { todo: true });

    /**
     * 영향력 있는 이벤트는 관심 가진 사람의 수가 n명 이상인 경우를 지칭
     * 서비스 초반에는 n의 숫자를 낮게 잡아서, 모든 디자이너가 볼 수 있게 한다.
     * n은 static한 값으로 지정하여 관리해야 한다.
     */
    it('영향력있는 이벤트는 체크하지 않더라도 날짜로 표기된다.', { todo: true });

    /**
     * 이벤트 타입의 게시글에 관심을 보인 경우 ( 따로 버튼을 클릭한 경우에 해당. ),
     * 해당 이벤트에 대한 팔로우업이 진행된다.
     */
    it('내가 팔로우업한 이벤트들의 날짜가 표시되어야 한다.', { todo: true });

    /**
     * 자신이 쓴 글을 날짜 별로 보고 싶은 니즈가 있을 거라고 추론.
     */
    it('내가 작성한 글들의 작성 날짜가 표기되어야 한다.', { todo: true });

    /**
     * 게시글이나 댓글 등 다른 리소스가 아니라 캘린더만의 DB Table을 사용해야 한다.
     */
    it('직접 달력에 일정을 기록할 수 있다.', { todo: true });

    it('다른 사람이 생성한 일정이 공유되어 있을 경우에는 조회되어야 한다.', { todo: true });

    it('필터를 통해서 특정 게시글의 일정을 비가시화할 수 있어야 한다.', { todo: true });
    it('필터를 통해서 특정 유저의 일정을 비가시화할 수 있어야 한다.', { todo: true });
    it('필터를 통해서 특정 댓글의 일정을 비가시화할 수 있어야 한다.', { todo: true });
    it('필터를 통해서 특정 일정을 비가시화할 수 있어야 한다.', { todo: true });
  });

  describe('POST api/v1/calendar', { concurrency: true }, () => {
    it('원하는 날짜에 기념일을 추가할 수 있다.', { todo: true });
    it('직접 생성한 이벤트를 다른 사람의 캘린더에 공유할 것인지 유무를 결정할 수 있어야 한다.', { todo: true });
  });

  describe('DELETE api/v1/calendar/:id', { concurrency: true }, () => {
    it('직접 생성한 이벤트의 경우 원하는 날짜의 기념일을 삭제할 수 있다.', { todo: true });
  });
});
