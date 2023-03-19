import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { BodyImageEntity } from '../tables/body-image.entity';

@CustomRepository(BodyImageEntity)
export class BodyImagesRepository extends Repository<BodyImageEntity> {}
