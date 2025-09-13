import * as nodeCrypto from 'crypto';

if (!(global as any).crypto) {
  (global as any).crypto = nodeCrypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // Start HTTP server (for direct REST API access)
  const app = await NestFactory.create(AppModule);
  await app.listen(3001, '0.0.0.0');
  console.log('User Service HTTP running on port 3001 🌐');

  // Start Redis microservice (for inter-service communication)
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: { host: 'redis', port: 6379 },
  });

  await app.startAllMicroservices();
  console.log('User Service Redis microservice running 🚀');
}

bootstrap();
