import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

export let app: INestApplication
async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log', 'verbose', 'warn', 'error'],
  })

  app.setGlobalPrefix('inventario')
  app.enableCors({ origin: '*' })

  app.enableShutdownHooks()

  await app.listen(3000, () => '🔥 Server started at http://localhost:3000')
}

bootstrap();
