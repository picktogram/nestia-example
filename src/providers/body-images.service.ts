import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyImagesRepository } from '@root/models/repositories/body-images.repository';

@Injectable()
export class BodyImagesService {
  constructor(@InjectRepository(BodyImagesRepository) private readonly bodyImagesRepository: BodyImagesRepository) {}
}
