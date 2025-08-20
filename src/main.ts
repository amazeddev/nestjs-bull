import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { swaggerSetup } from './swagger-setup';
import { CommonConfig } from './config/common.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const commonConfig = app.get<ConfigType<typeof CommonConfig>>(
    CommonConfig.KEY,
  );
  if (commonConfig.env === 'development') {
    const morgan = await import('morgan');
    app.use(morgan.default('[:date[clf]] :method :url :status'));
  }
  app.enableCors({
    origin: [
      ...commonConfig.frontUrl,
      ...(commonConfig.env === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : []),
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // transform: true,
    }),
  );
  if (commonConfig.env === 'development') {
    swaggerSetup(app);
  }
  await app.listen(commonConfig.port);
}
bootstrap();
