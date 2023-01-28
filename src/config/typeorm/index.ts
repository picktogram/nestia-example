import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

export const TypeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const NODE_ENV = configService.get('NODE_ENV');

    const option = {
      type: configService.get('DB_TYPE'),
      host: configService.get(`${NODE_ENV}_DB_HOST`),
      port: Number(configService.get<number>(`${NODE_ENV}_DB_PORT`)),
      username: configService.get(`${NODE_ENV}_DB_USERNAME`),
      database: configService.get(`${NODE_ENV}_DB_DATABASE`),
      password: configService.get(`${NODE_ENV}_DB_PASSWORD`),
      entities: [
        path.join(__dirname, '../../models/tables/*.ts'),
        path.join(__dirname, '../../models/tables/*.js'),
      ],
      synchronize: true,
      socketPath: '/tmp/mysql.sock',
      ...(NODE_ENV === 'DEVELOPMENT'
        ? { retryAttempts: 10, logging: true }
        : { logging: false }),
    };

    console.log(option);
    return option;
  },
};
