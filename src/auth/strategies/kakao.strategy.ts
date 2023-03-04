import { Strategy, Profile } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('KAKAO_REST_API_KEY'),
      clientSecret: '', // 이거 없어도 될것 같은데 없앨까요??
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
    const kakaoAccount = profile._json.kakao_account;

    const email = kakaoAccount.email || null;
    const nickname = kakaoAccount.profile.nickname;
    const kakaoId = profile._json.id;

    const payload = {
      nickname,
      email,
      kakaoId,
    };

    done?.(null, payload);
  }
}
