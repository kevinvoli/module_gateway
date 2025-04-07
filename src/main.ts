import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxyFactory, MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';

import * as os from 'os';
import { AllExceptionsFilter } from './custom-exception-filter';



function getLocalIPAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retourne la première adresse IPv4 non interne
      }
    }
  }
  return '127.0.0.1'; // Adresse de repli si aucune adresse n'est trouvée
}
// 192.168.183.216
const hostName = getLocalIPAddress()
const port = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: hostName,
      port: port,
       // Port utilisé par le Gateway pour communiquer avec les services
    },
  });

 
    // Synchronisation des microservices
    await app.startAllMicroservices();
    console.log('Gateway connecté aux microservices via TCP',port);
    
    app.enableCors({
      origin: '*', // URL du front-end
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    // Serveur HTTP du Gateway
    await app.listen(3003);
    console.log(`server http tourne sur l'addresse http://${hostName}:${3003}`);
}
bootstrap();