import { Controller, Get } from '@nestjs/common';
import { BodyImagesService } from '@root/providers/body-images.service';

@Controller('api/v1/body-image')
export class BodyImagesController {
  constructor(private readonly bodyImagesService: BodyImagesService) {}
}
