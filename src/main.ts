import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3000, // Port utilisé par le Gateway pour communiquer avec les services
    },
  });

    // Synchronisation des microservices
    await app.startAllMicroservices();
    console.log('Gateway connecté aux microservices via TCP');
  
    // Serveur HTTP du Gateway
    await app.listen(3003);
    console.log('Gateway HTTP disponible sur http://127.0.0.1:3003');
}
bootstrap();
