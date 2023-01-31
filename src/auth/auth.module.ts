import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/tables/user';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CategoriesModule } from '@root/modules/categories.module';
import { ArticlesModule } from '@root/modules/articles.module';
import { UsersModule } from '@root/modules/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { BodyImageModule } from '@root/modules/body-images.module';
import { CommentsModule } from '@root/modules/comments.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('ACCESS_KEY'),
          signOptions: { algorithm: 'HS256', expiresIn: '1y' },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    CategoriesModule,
    ArticlesModule,
    BodyImageModule,
    CommentsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
