import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  const swaggerDocument = JSON.parse(swaagerConfig);
  const configSerivce = app.get(ConfigService);

  const env = configSerivce.get('NODE_ENV');
  swaggerDocument.servers.at(0).url = configSerivce.get(`${env}_SERVER_HOST`);

  SwaggerModule.setup('api/nestia', app, swaggerDocument);
};
