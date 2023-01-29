import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '@root/config/typeorm/custom-typeorm.module';
import { BodyImagesController } from '@root/controllers/body-images.controller';
import { BodyImagesRepository } from '@root/models/repositories/body-images.repository';
import { BodyImagesService } from '@root/providers/body-images.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BodyImagesRepository])],
  controllers: [BodyImagesController],
  providers: [BodyImagesService],
})
export class BodyImageModule {}
