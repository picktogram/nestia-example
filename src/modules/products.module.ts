import { Module } from '@nestjs/common';
import { ProductsService } from '../providers/products.service';
import { ProductsController } from '../controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from '@root/models/repositories/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsRepository])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
