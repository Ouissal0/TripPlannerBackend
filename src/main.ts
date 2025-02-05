import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
  app.use(express.json({ limit: '50mb' })); // Augmenter la limite pour JSON
  app.use(express.urlencoded({ limit: '50mb', extended: true })); // Augmenter la limite pour form-data

  await app.listen( 3000,'192.168.233.154');
}
bootstrap();
