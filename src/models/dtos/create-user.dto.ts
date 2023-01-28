import { PickType } from '@nestjs/swagger';
import { User } from '../tables/user';

export class CreateUserDto extends PickType(User, [
  'name',
  'nickname',
  'email',
  'password',
  'phoneNumber',
  'birth',
  'gender',
  'smsAdsConsent',
  'emailAdsConsent',
] as const) {}
