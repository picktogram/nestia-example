import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../models/tables/article';
import { TypeOrmModuleOptions } from '../config/typeorm';
import { ArticlesController } from '../controllers/articles.controller';
import { ArticlesService } from '../providers/articles.service';
import { ArticlesModule } from '../modules/articles.module';
import { User } from '@root/models/tables/user';
import { generateRandomNumber } from '@root/utils/generate-random-number';
import { GetAllArticlesResponseDto } from '@root/models/response/get-all-articles-response.dto';

describe('Article Entity', () => {
  let controller: ArticlesController;
  let service: ArticlesService;
  let article;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([Article]),
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
    let reader: User;
    let writer: User;

    describe('일반적인 경우에 대한 검증', () => {
      /**
       * response
       */
      let list: GetAllArticlesResponseDto[];
      let count: number;
      beforeAll(async () => {
        const readerMetadata = generateRandomNumber(1000, 9999, true);

        reader = await User.save({
          name: readerMetadata,
          nickname: readerMetadata,
          password: readerMetadata,
        });

        const writerMetadata = generateRandomNumber(1000, 9999, true);
        writer = await User.save({
          name: writerMetadata,
          nickname: writerMetadata,
          password: writerMetadata,
        });

        await Article.save({ writerId: writer.id, contents: writerMetadata });

        const response = await service.read(reader.id, { page: 1, limit: 10 });
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
        expect(list.at(0)['commentMetadata']).toBeInstanceOf(Array);
      });
    });

    it('본인이 게시글의 작성자인 경우에는 본인인 줄 알 수 있게 표기가 되어야 한다.', async () => {
      const response = await service.read(writer.id, { page: 1, limit: 10 });
      const myArticle = response.list.find((el) => el.writer.id === writer.id);

      expect(myArticle).toBeDefined();
      expect(myArticle['isMine']).toBeTruthy();
    });

    it('게시글의 댓글 배열은 인기 순, 좋아요 순으로 정렬되어야 한다.', async () => {});

    it('게시글의 글 순서는 기본적으로는 시간 순이다.', async () => {});

    it('시간 순이되, 보여지는 글은 유명인이거나 1촌 등 가까운 사이의 글만 노출된다.', async () => {});

    it('게시글의 작성자가 이탈한 경우 프로필 사진과 이름은 익명으로 표기되어야 한다.', async () => {});
  });
});
