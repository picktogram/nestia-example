import { PickType } from '@nestjs/swagger';
import { BodyImage } from '../tables/bodyImage';

export class CreateRootBodyImageDto extends PickType(BodyImage, [
  'url',
  'position',
]) {
  position = 0;
}
