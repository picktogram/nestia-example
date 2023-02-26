import { UserEntity } from '../tables/user.entity';

export type CreateUserDto = Pick<
  UserEntity,
  'name' | 'nickname' | 'email' | 'password' | 'phoneNumber' | 'birth' | 'gender' | 'smsAdsConsent' | 'emailAdsConsent'
>;
