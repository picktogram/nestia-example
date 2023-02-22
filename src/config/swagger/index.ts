import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';

import path from 'path';

export const SwaggerSetting = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('picktogram server docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('kakasoo')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' }, 'Bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const swaagerConfig = readFileSync(path.join(__dirname, '../../swagger.json'), 'utf8');
  SwaggerModule.setup('api/nestia', app, JSON.parse(swaagerConfig));
};
