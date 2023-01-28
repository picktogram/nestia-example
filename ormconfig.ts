import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

export const ormconfig = {
  type: 'mysql',
  host: process.env[`${NODE_ENV}_DB_HOST`],
  port: Number(process.env[`${NODE_ENV}_DB_PORT`]),
  username: process.env[`${NODE_ENV}_DB_USERNAME`],
  password: process.env[`${NODE_ENV}_DB_PASSWORD`],
  database: process.env[`${NODE_ENV}_DB_DATABASE`],
  entities: [join(__dirname, '/src/models/tables/*.ts')],
  synchronize: false,
  charset: 'utf8mb4',
  logging: true,
};

export default ormconfig;
