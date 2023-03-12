import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as ArticleApis from '../../api/functional/api/v1/articles';
import * as AuthApis from '../../api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { CreateArticleDto } from '../../models/dtos/create-article.dto';
import { ArticleEntity } from '../../models/tables/article.entity';
import { CreateCommentDto } from '../../models/dtos/create-comment.dto';
import { CommentEntity } from '../../models/tables/comment.entity';
import { DecodedUserToken } from '../../models/tables/user.entity';

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
    let token: string = '';
    beforeAll(async () => {
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('게시글 조회 테스트', async () => {
      const response = await ArticleApis.getAllArticles(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(response.data.list).toBeInstanceOf(Array);
    });

    it.todo('각 게시글 타입 별 프로퍼티에 대한 검증 필요');
  });

  /**
   * 답변을 기다리는 질문
   */
  describe('GET api/v1/articles/no-reply', () => {
    let token: string = '';
    let decodedToken: DecodedUserToken;
    beforeEach(async () => {
      const designer = typia.random<CreateUserDto>();
      const signUpResponse = await AuthApis.sign_up.signUp({ host }, designer);
      decodedToken = signUpResponse.data;

      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('질문 게시글 조회', async () => {
      const getAllWithNoReplyResponse = await ArticleApis.no_reply.getAllWithNoReply(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(getAllWithNoReplyResponse.data.list).toBeInstanceOf(Array);
    });

    it('질문이 아닌 글은 작성해도 조회되지 말아야 한다.', async () => {
      // NOTE : 질문이 아닌 글은 조회 되서는 안 된다.
      const dummyWriting = typia.random<CreateArticleDto>();
      dummyWriting.type = 'writing';
      const writing = await ArticleApis.writeArticle(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { contents: dummyWriting.contents, type: dummyWriting.type },
      );

      const getAllWithNoReplyResponse = await ArticleApis.no_reply.getAllWithNoReply(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(getAllWithNoReplyResponse.data.list.some((el) => el.id === writing.data.id)).toBeFalsy();
    });

    it.only('"댓글이 없는 질문 타입의 게시글"만 나오는지에 대한 검증', async () => {
      // NOTE : 질문이면서 댓글이 없는 경우는 조회되어야 한다.
      const dummyQuestion = typia.random<CreateArticleDto>();
      dummyQuestion.type = 'question';
      const questionWithNoReply = await ArticleApis.writeArticle(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { contents: dummyQuestion.contents, type: dummyQuestion.type },
      );

      const getAllWithNoReplyResponse = await ArticleApis.no_reply.getAllWithNoReply(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(getAllWithNoReplyResponse.data.list).toBeInstanceOf(Array);
      expect(getAllWithNoReplyResponse.data.list.some((el) => el.id === questionWithNoReply.data.id)).toBeTruthy();
    });

    it('질문형 게시글이지만 댓글이 있는 경우에는 조회되지 말아야 한다.', async () => {
      // NOTE : 질문이지만 댓글이 달린 경우는 조회되서는 안 된다.
      const dummyQuestionWithReply = typia.random<CreateArticleDto>();
      const dummyReply = typia.random<CreateCommentDto>();
      dummyQuestionWithReply.type = 'question';
      const questionWithReply = await ArticleApis.writeArticle(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { contents: dummyQuestionWithReply.contents, type: dummyQuestionWithReply.type },
      );

      await CommentEntity.save({
        contents: dummyReply.contents,
        articleId: questionWithReply.data.id,
        writerId: decodedToken.id,
      });

      const getAllWithNoReplyResponse = await ArticleApis.no_reply.getAllWithNoReply(
        {
          host,
          headers: {
            Authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(getAllWithNoReplyResponse.data.list).toBeInstanceOf(Array);
      expect(getAllWithNoReplyResponse.data.list.some((el) => el.id === questionWithReply.data.id)).toBeFalsy();
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
