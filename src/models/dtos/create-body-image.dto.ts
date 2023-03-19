import { BodyImageEntity } from '../tables/body-image.entity';

export interface CreateRootBodyImageDto extends Pick<BodyImageEntity, 'url' | 'position'> {}
