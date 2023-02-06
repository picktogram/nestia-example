import { PickType } from '@nestjs/swagger';
import { BodyImageEntity } from '../tables/bodyImage.entity';

export class CreateRootBodyImageDto extends PickType(BodyImageEntity, ['url', 'position']) {
  position = 0;
}
