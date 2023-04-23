import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../providers/users.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { UsersRepository } from '../models/repositories/users.repository';
import { UserBridgesRepository } from '../models/repositories/user-bridge.repository';
import { ArticlesRepository } from '../models/repositories/articles.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([UsersRepository, UserBridgesRepository, ArticlesRepository])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
