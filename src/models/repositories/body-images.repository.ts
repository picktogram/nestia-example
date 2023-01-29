import { CustomRepository } from '@root/config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { BodyImage } from '../tables/bodyImage';

@CustomRepository(BodyImage)
export class BodyImagesRepository extends Repository<BodyImage> {}
