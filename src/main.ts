import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxyFactory, MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as net from 'net';
import { firstValueFrom } from 'rxjs';
import * as os from 'os';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CustomTcpExceptionFilter } from './custom-exception-filter';


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

app.useGlobalFilters(new CustomTcpExceptionFilter());
  

    app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: hostName,
      port: port,
       // Port utilisé par le Gateway pour communiquer avec les services
    },
  });


  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Cela transforme les objets bruts en instances de DTO
    whitelist: true, // Cela supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Empêche l'envoi de propriétés non spécifiées
  }));
    // Synchronisation des microservices
    await app.startAllMicroservices();
    console.log('Gateway connecté aux microservices via TCP',port);
    
    // Serveur HTTP du Gateway
    await app.listen(3003);
    console.log(`server http tourne sur l'addresse http://${hostName}:${3003}`);
}
bootstrap();