import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { BodyImageEntity } from '../tables/bodyImage.entity';

@CustomRepository(BodyImageEntity)
export class BodyImagesRepository extends Repository<BodyImageEntity> {}
