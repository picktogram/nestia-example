import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/tables/user.entity';
import { TypeOrmModuleOptions } from '../config/typeorm';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../providers/users.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../modules/users.module';
import { AuthService } from '../auth/auth.service';
import { generateRandomNumber } from '@root/utils/generate-random-number';
import { UserBridgeEntity } from '@root/models/tables/userBridge.entity';

describe('User Entity', () => {
  let controller: UsersController;
  let service: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        TypeOrmModule.forFeature([UserEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        AuthModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);

    authService = module.get<AuthService>(AuthService);
  });

  describe('0. 테스트 환경을 확인합니다.', () => {
    it('0-1. Service와 Controller 가 정의되어야 합니다.', async () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });

  describe('1. 유저의 생성 로직을 검증합니다.', () => {
    // let user: UserEntity;
    // afterEach(async () => {
    //   const searched = await User.findOne({ where: { id: user.id } });
    //   if (searched) {
    //     await User.remove(searched);
    //   }
    // });
    // it('1-1. 유저를 생성하거나 조회합니다.', async () => {
    //   user = await controller.signUp({
    //     name: 'test',
    //     nickname: 'test',
    //     email: 'test',
    //     password: 'test',
    //     phoneNumber: 'test',
    //     birth: new Date(1997, 10, 6),
    //     gender: true,
    //     smsAdsConsent: true,
    //     emailAdsConsent: true,
    //   });
    //   console.log(user);
    //   expect(user).toBeDefined();
    // });
  });

  describe('2. 유저의 좋아요 기능을 검증', () => {
    const NON_EXIST = 987654321;
    let follower: UserEntity;
    let followee: UserEntity;

    beforeEach(async () => {
      const folwerMetadata = generateRandomNumber(1000, 9999, true);
      follower = await UserEntity.save({
        name: folwerMetadata,
        nickname: folwerMetadata,
        password: folwerMetadata,
      });

      const followeeMetadata = generateRandomNumber(1000, 9999, true);
      followee = await UserEntity.save({
        name: followeeMetadata,
        nickname: followeeMetadata,
        password: followeeMetadata,
      });
    });

    afterEach(async () => {
      follower = null;
      followee = null;
    });

    it('유저 좋아요 시 좋아요 성공 시 현재 관계 상태를 리턴한다.', async () => {
      const response: UserBridgeEntity = await controller.follow(follower.id, followee.id);

      expect(response).toBeDefined();
      expect(response.firstUserId).toBe(follower.id);
      expect(response.secondUserId).toBe(followee.id);
      expect(response.status).toBe('follow');
    });

    it('이미 좋아요를 누른 유저에게 좋아요 시 에러를 발생시킨다.', async () => {
      try {
        await controller.follow(follower.id, followee.id);
        await controller.follow(follower.id, followee.id);

        expect(1).toBe(2);
      } catch (err) {
        expect(err.message).toBe('이미 좋아요를 누른 디자이너입니다!');
      }
    });

    it('존재하지 않는 유저에 대해서는 좋아요를 할 수 없어야 한다.', async () => {
      try {
        await controller.follow(follower.id, NON_EXIST);
        expect(1).toBe(2);
      } catch (err) {
        expect(err.message).toBe('팔로우할 디자이너를 찾지 못했습니다.');
      }
    });

    it('좋아요한 상대에게 좋아요를 받은 경우 userBridge의 상태 값이 맞팔(followUp)으로 변경된다.', async () => {
      await controller.follow(follower.id, followee.id);
      const response: UserBridgeEntity = await controller.follow(followee.id, follower.id);

      expect(response.status).toBe('followUp');
    });

    // TODO : 팔로우를 끊는 API에서 테스트할 것
    // it('좋아요한 상대에게 좋아요를 받은 직후 좋아요를 끊을 경우, 좋아요 관계가 역전(reverse)으로 변경된다.', async () => {});
  });
});
