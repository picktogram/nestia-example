import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { BodyImagesController } from '../controllers/body-images.controller';
import { BodyImagesRepository } from '../models/repositories/body-images.repository';
import { BodyImagesService } from '../providers/body-images.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BodyImagesRepository])],
  controllers: [BodyImagesController],
  providers: [BodyImagesService],
})
export class BodyImageModule {}
