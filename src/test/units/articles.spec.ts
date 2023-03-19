import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../../models/tables/article.entity';
import { TypeOrmModuleOptions } from '../../config/typeorm';
import { ArticlesController } from '../../controllers/articles.controller';
import { ArticlesService } from '../../providers/articles.service';
import { ArticlesModule } from '../../modules/articles.module';
import { UserEntity } from '../../models/tables/user.entity';
import { generateRandomNumber } from '../../utils/generate-random-number';
import { GetAllArticlesResponseDto } from '../../models/response/get-all-articles-response.dto';
import { CommentEntity } from '../../models/tables/comment.entity';

describe('Article Entity', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([ArticleEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
        ArticlesModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    controller = module.get<ArticlesController>(ArticlesController);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it('0-1. Service와 Controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });

  describe('GET api/v1/articles', () => {
    describe('리턴 값에 대한 검증', () => {
      let reader: UserEntity;

      /**
       * response
       */
      let list: GetAllArticlesResponseDto[] = [];
      let count: number = 0;
      beforeAll(async () => {
        const readerMetadata = generateRandomNumber(1000, 9999, true);

        reader = await UserEntity.save({
          name: readerMetadata,
          nickname: readerMetadata,
          password: readerMetadata,
        });

        const response = await service.read(reader.id, { page: 1, limit: 10 }, {});
        list = response.list;
        count = response.count;
      });

      it('게시글은 페이지네이션 형태로 작성되어야 한다.', async () => {
        expect(list).toBeInstanceOf(Array);
        expect(typeof count).toBe('number');
      });

      it('게시글에는 작성자가 포함되어 있어야 하며, 이름과 사진을 알아볼 수 있어야 한다.', async () => {
        list.forEach((article) => {
          expect(article.writer).toBeDefined();
          expect(article.writer.id).toBeDefined();
          expect(article.writer.profileImage).toBeDefined();
          expect(article.writer.nickname).toBeDefined();
        });
      });

      it('게시글 리스트에서도 일정 개수(length) 이상의 댓글 배열이 포함되어 있어야 한다.', async () => {
        const article = list.at(0);
        expect(article).toBeDefined();
        if (article) {
          expect(article['commentMetadata']).toBeInstanceOf(Array);
        }
      });
    });

    describe('게시글 리스트 조회 시 작성자에 대한 정보 검증', () => {
      let writer: UserEntity;

      beforeAll(async () => {
        const writerMetadata = generateRandomNumber(1000, 9999, true);
        writer = await UserEntity.save({
          name: writerMetadata,
          nickname: writerMetadata,
          password: writerMetadata,
        });

        await ArticleEntity.save({ writerId: writer.id, contents: writerMetadata, type: 'question' });
      });

      it('본인이 게시글의 작성자인 경우에는 본인인 줄 알 수 있게 표기가 되어야 한다.', async () => {
        const response = await service.read(writer.id, { page: 1, limit: 10 }, {});
        const myArticle = response.list.find((el) => el.writer.id === writer.id);

        expect(myArticle).toBeDefined();
        if (myArticle) {
          expect(myArticle['isMine']).toBeTruthy();
        }
      });
    });

    describe('게시글 내부의 댓글에 대한 검증', () => {
      let writer: UserEntity;
      let article: ArticleEntity;
      let comments: CommentEntity[];

      /**
       * response
       */
      let list: GetAllArticlesResponseDto[];
      let count: number;

      beforeAll(async () => {
        const writerMetadata = generateRandomNumber(1000, 9999, true);
        writer = await UserEntity.save({
          name: writerMetadata,
          nickname: writerMetadata,
          password: writerMetadata,
        });

        article = await ArticleEntity.save({ writerId: writer.id, contents: writerMetadata, type: 'question' });
        comments = await CommentEntity.save(
          [1, 2, 3].map((el) => {
            return CommentEntity.create({
              articleId: article.id,
              writerId: writer.id,
              contents: `test${el}`,
            });
          }),
        );

        const response = await service.read(writer.id, { page: 1, limit: 100 }, {});
        list = response.list;
      });

      it('게시글의 글 순서는 기본적으로는 시간 순이다.', async () => {
        const [created]: GetAllArticlesResponseDto[] = list.filter((el) => el['id'] === article.id);
        const sorted = created.comments.sort((a, b) => a.id - b.id);

        const isSame = JSON.stringify(created.comments) === JSON.stringify(sorted);

        expect(isSame).toBeTruthy();
      });

      it('게시글의 댓글 배열은 인기 순, 좋아요 순으로 정렬되어야 한다.', async () => {});
    });

    describe('시간 순이되, 보여지는 글은 유명인이거나 1촌 등 가까운 사이의 글만 노출된다.', () => {});

    describe('게시글의 작성자가 이탈한 경우 프로필 사진과 이름은 익명으로 표기되어야 한다.', () => {});
  });

  describe('POST api/v1/articles', () => {
    it('동일한 포지션의 이미지가 있을 경우 에러를 발생 1.', async () => {
      const positions = [1, 2, 3, 4, 5, 6, 6].map((position) => ({ position }));
      try {
        const checkIsSame = service['checkIsSamePosition'](positions);
        expect(checkIsSame).toBe('This is to be failed.');
      } catch (err: any) {
        expect(err?.response?.data).toBe('이미지의 정렬 값이 동일한 경우가 존재합니다.');
      }
    });

    it('postion 값이 0과 1일 경우 에러로 처리되는 문제 발생 2.', async () => {
      // NOTE : 프론트 측의 오류 제보로 인해 추가
      const positions = [0, 1].map((position) => ({ position }));
      try {
        const checkIsSame = service['checkIsSamePosition'](positions);
        expect(JSON.stringify(checkIsSame)).toBe(JSON.stringify(positions));
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });

    it('이미지의 정렬 값이 동일한 경우가 존재하면 안 된다.', async () => {
      const positions = [undefined, undefined, undefined].map((position) => ({ position }));
      const answer = [0, 1, 2].map((position) => ({ position }));

      const checkIsSame = service['checkIsSamePosition'](positions);
      expect(JSON.stringify(checkIsSame)).toBe(JSON.stringify(answer));
    });
  });

  describe('GET api/v1/articles', () => {
    let writer: UserEntity;
    let article: ArticleEntity;
    let comments: CommentEntity[];

    beforeAll(async () => {
      const writerMetadata = generateRandomNumber(1000, 9999, true);
      writer = await UserEntity.save({
        name: writerMetadata,
        nickname: writerMetadata,
        password: writerMetadata,
      });

      article = await ArticleEntity.save({ writerId: writer.id, contents: writerMetadata, type: 'question' });
      comments = await CommentEntity.save(
        [1, 2, 3].map((el) => {
          return CommentEntity.create({
            articleId: article.id,
            writerId: writer.id,
            contents: `test${el}`,
          });
        }),
      );
    });

    it('게시글을 조회할 때, 게시글에 댓글이 있는 경우 댓글이 조회되어야 한다.', async () => {
      const detailArticle = await controller.getOneDetailArticle(writer.id, article.id);

      expect(detailArticle.data).toBeDefined();
      if (detailArticle.data) {
        expect(detailArticle.data.comments).toBeInstanceOf(Array);
        if (detailArticle.data.comments) {
          expect(detailArticle.data.comments.length).toBeGreaterThan(0);
          expect(detailArticle.data.comments.length).toBe(3);
          const comment = detailArticle.data.comments.at(0);
          expect(comment).toBeDefined();

          if (comment) {
            expect(comment.id).toBeDefined();
            expect(comment.parentId).toBeDefined();
            expect(comment.contents).toBeDefined();
            expect(comment.xPosition).toBeDefined();
            expect(comment.yPosition).toBeDefined();
          }
        }
      }
    });
  });

  describe('GET api/v1/articles/:id/comments', () => {
    let writer: UserEntity;
    let article: ArticleEntity;
    let comments: CommentEntity[];

    beforeAll(async () => {
      const writerMetadata = generateRandomNumber(1000, 9999, true);
      writer = await UserEntity.save({
        name: writerMetadata,
        nickname: writerMetadata,
        password: writerMetadata,
      });

      article = await ArticleEntity.save({ writerId: writer.id, contents: writerMetadata, type: 'question' });
      comments = await CommentEntity.save(
        [1, 2, 3].map((el) => {
          return CommentEntity.create({
            articleId: article.id,
            writerId: writer.id,
            contents: `test${el}`,
          });
        }),
      );
    });

    it('특정 게시글의 댓글을 조회하는, 페이지네이션 함수가 제공된다.', async () => {
      const comment1 = await controller.readComments(article.id, { page: 1, limit: 1 });
      const comment2 = await controller.readComments(article.id, { page: 2, limit: 1 });
      const comment3 = await controller.readComments(article.id, { page: 3, limit: 1 });

      [comment1.data?.list.at(0), comment2.data?.list.at(0), comment3.data?.list.at(0)].forEach((comment, i) => {
        expect(comment).toBeDefined();
        if (comment) {
          const searchedComment = comments.at(i);
          if (searchedComment) {
            expect(comment.id).toBe(searchedComment.id);
          }
        }
      });
    });
  });
});
