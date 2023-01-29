import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  SwaggerSetting(app);
  await app.listen(3000, () => {
    if (process.env.NODE_ENV === 'production') {
      process.send('ready');
    }
  });
}
bootstrap();
