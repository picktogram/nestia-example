import { BodyImageEntity } from '../tables/bodyImage.entity';

export interface CreateRootBodyImageDto extends Pick<BodyImageEntity, 'url' | 'position'> {}
