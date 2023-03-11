import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as ArticleApis from '../../api/functional/api/v1/articles';
import * as AuthApis from '../../api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { CreateArticleDto } from '../../models/dtos/create-article.dto';

describe('E2E articles test', () => {
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

  describe('POST api/v1/articles', () => {
    let token: string = '';
    beforeAll(async () => {
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('게시글이 생성되는 것을 확인한다.', async () => {
      const writeArticleResponse = await ArticleApis.writeArticle(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        typia.random<CreateArticleDto>(),
      );

      expect(writeArticleResponse.data).toBeDefined();
    });
  });

  describe('GET api/v1/articles', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 답변을 기다리는 질문
   */
  describe('GET api/v1/articles/no-reply', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 게시글에 대한 좋아요/좋아요 취소
   */
  describe('PATCH api/v1/articles/:id', () => {});

  /**
   * 게시글 신고
   */
  describe('POST api/v1/articles/:id/reports', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 게시글 중 그리기에 해당하는 글에 대한 수정
   */
  describe('PUT api/v1/articles/:id/drawing', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 게시글에 댓글 남기기
   * 그리기 타입 글에 대해서는 댓글에 좌표 값이 반드시 있어야 한다.
   */
  describe('POST api/v1/articles/:id/comments', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 답글 달기
   */
  describe('POST api/v1/articles/:articleId/comments/:commentId', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 댓글에 대한 좋아요/좋아요 취소
   */
  describe('PATCH api/v1/articles/:articleId/comments/:commentId', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 댓글 삭제
   */
  describe('DELETE api/v1/articles/:articleId/comments/:commentId', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 댓글 수정
   * 수정 시에는, 이전 내역이 욕설이나 그 외 상대의 기분을 해칠 수 있는 댓글인지를 확인해야 한다.
   */
  describe('PUT api/v1/articles/:articleId/comments/:commentId', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });

  /**
   * 댓글 신고
   * 댓글이 신고된 경우, 해당 댓글의 내역을, 유저가 수정할 경우를 대비해 따로 저장해두어야 한다.
   */
  describe('POST api/v1/articles/:articleid/comments/:commentId', () => {
    it('', async () => {
      expect(1).toBe(2);
    });
  });
});
