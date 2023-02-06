import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../providers/users.service';
import { CustomTypeOrmModule } from '@root/config/typeorm/custom-typeorm.module';
import { UsersRepository } from '@root/models/repositories/users.repository';
import { UserBridgesRepository } from '@root/models/repositories/user-bridge.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([UsersRepository, UserBridgesRepository])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
