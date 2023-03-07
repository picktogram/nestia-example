import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../models/tables/user.entity';
import { TypeOrmModuleOptions } from '../../config/typeorm';
import { UsersController } from '../../controllers/users.controller';
import { UsersService } from '../../providers/users.service';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../modules/users.module';
import { AuthService } from '../../auth/auth.service';
import { generateRandomNumber } from '../../utils/generate-random-number';
import { UserBridgeEntity } from '../../models/tables/userBridge.entity';

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

  describe('1. 디자이너의 생성 로직을 검증합니다.', () => {
    // let user: UserEntity;
    // afterEach(async () => {
    //   const searched = await User.findOne({ where: { id: user.id } });
    //   if (searched) {
    //     await User.remove(searched);
    //   }
    // });
    // it('1-1. 디자이너를 생성하거나 조회합니다.', async () => {
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

  describe('2. 디자이너의 좋아요 기능을 검증', () => {
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

    it('디자이너 좋아요 시 좋아요 성공 시 현재 관계 상태를 리턴한다.', async () => {
      const response = await controller.follow(follower.id, followee.id);
      const userBridge = await UserBridgeEntity.findOne({
        where: { firstUserId: follower.id, secondUserId: followee.id },
      });

      expect(response.data).toBe(true);
      expect(userBridge).toBeDefined();
      if (userBridge) {
        const { firstUserId, secondUserId } = userBridge;
        expect(firstUserId).toBe(follower.id);
        expect(secondUserId).toBe(followee.id);
      }
    });

    it('이미 좋아요를 누른 디자이너에게 좋아요 시 에러를 발생시킨다.', async () => {
      try {
        await controller.follow(follower.id, followee.id);
        await controller.follow(follower.id, followee.id);

        expect(1).toBe(2);
      } catch (err: any) {
        expect(err.message).toBe('이미 좋아요를 누른 디자이너님입니다!');
      }
    });

    it('존재하지 않는 디자이너에 대해서는 좋아요를 할 수 없어야 한다.', async () => {
      try {
        await controller.follow(follower.id, NON_EXIST);
        expect(1).toBe(2);
      } catch (err: any) {
        expect(err.message).toBe('팔로우할 디자이너님을 찾지 못했습니다.');
      }
    });

    // NOTE : deprecated
    // it.skip('좋아요한 상대에게 좋아요를 받은 경우 userBridge의 상태 값이 맞팔(followUp)으로 변경된다.', async () => {
    //   await controller.follow(follower.id, followee.id);
    //   await controller.follow(followee.id, follower.id);
    //   const response = await UserBridgeEntity.findOne({
    //     where: { firstUserId: follower.id, secondUserId: followee.id },
    //   });

    //   expect(response.status).toBe('followUp');
    // });
  });

  describe('디자이너의 언 팔로우 기능을 검증', () => {
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

    it('좋아요한 상대에게 좋아요를 받은 직후 좋아요를 끊을 경우, 좋아요 관계가 역전(reverse)으로 변경된다.', async () => {
      // NOTE : 맞팔로우한 관계를 생성
      const isCreated = await UserBridgeEntity.save({
        firstUserId: follower.id,
        secondUserId: followee.id,
      });

      // NOTE : 생성 된 것이 맞는 지 검증하기 위해 original이라는 변수에 새로 조회하여 저장
      const original = await UserBridgeEntity.findOne({
        where: { firstUserId: follower.id, secondUserId: followee.id },
      });

      // NOTE : 최초 팔로워로부터 팔로우를 해제한 다음 다시 관계를 조회한다.
      await service.unfollow(follower.id, followee.id);
      const afterUnfollow = await UserBridgeEntity.findOne({
        where: { firstUserId: follower.id, secondUserId: followee.id },
      });

      expect(original).toBeDefined();
      if (original) {
        expect(isCreated.firstUserId).toBe(original.firstUserId);
        expect(isCreated.secondUserId).toBe(original.secondUserId);
      }

      expect(afterUnfollow).toBeNull();
    });
  });
});
