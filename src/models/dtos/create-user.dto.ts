import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../tables/user.entity';

// export class CreateUserDto extends PickType(UserEntity, [
//   'name',
//   'nickname',
//   'email',
//   'password',
//   'phoneNumber',
//   'birth',
//   'gender',
//   'smsAdsConsent',
//   'emailAdsConsent',
// ] as const) {}

export type CreateUserDto = Pick<
  UserEntity,
  'name' | 'nickname' | 'email' | 'password' | 'phoneNumber' | 'birth' | 'gender' | 'smsAdsConsent' | 'emailAdsConsent'
>;
