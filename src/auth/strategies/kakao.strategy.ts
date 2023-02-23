import { Strategy, Profile } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_REST_API_KEY,
      clientSecret: '',
      callbackURL: 'http://127.0.0.1:3000/api/users/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    /**
     * If you don't know method ?. operator,
     * just read below link.
     *
     * @link {https://stackoverflow.com/questions/56913963/cannot-invoke-an-object-which-is-possibly-undefined-ts2722}
     */
    done?.(null, profile);
  }
}
