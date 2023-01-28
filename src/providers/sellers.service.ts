import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '../models/tables/seller';
import { Repository } from 'typeorm';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
  ) {}
}
