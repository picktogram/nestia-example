import { Module } from '@nestjs/common';
import { SellersService } from '../providers/sellers.service';
import { SellersController } from '../controllers/sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from '../models/tables/seller';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
