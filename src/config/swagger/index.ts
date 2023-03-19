import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { readFileSync } from 'fs';

import path from 'path';

export const SwaggerSetting = (app: INestApplication) => {
  const swaagerConfig = readFileSync(path.join(__dirname, '../../swagger.json'), 'utf8');
  const swaggerDocument = JSON.parse(swaagerConfig);
  const configSerivce = app.get(ConfigService);

  const env = configSerivce.get('NODE_ENV');
  swaggerDocument.servers.at(0).url = configSerivce.get(`${env}_SERVER_HOST`);

  SwaggerModule.setup('api/nestia', app, swaggerDocument);
  SwaggerModule.setup('api', app, swaggerDocument);
};
