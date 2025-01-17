import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxyFactory, MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as net from 'net';
import { firstValueFrom } from 'rxjs';

const port = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '192.168.252.216',
      port: port,
       // Port utilisé par le Gateway pour communiquer avec les services
    },
  });

  // Crée un serveur TCP personnalisé
const tcpServer = net.createServer((socket) => {
  console.log('New connection established');

  // Client TCP pour communiquer avec NestJS
const nestClient = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: '192.168.252.216',
    port: port, // Correspond au port du service NestJS
  },
});

  // Écouter les données envoyées par le client
  socket.on('data', async (data) => {
    console.log('Data received:', data.toString());

    try {
      // Parse les données reçues
      const message = JSON.parse(data.toString());
      console.log("mes data:",message);
      

      // Envoyer le message au service NestJS
      const response = await firstValueFrom( nestClient.send({
        cmd:message.cmd }, 
        message.data ? message.data : {}
     ))
      console.log('Response from NestJS:', response);

      // Répondre au client
      socket.write(JSON.stringify(response) + '\n');
    } catch (error) {
      console.error('Error processing data:', error.message);
      socket.write(JSON.stringify({ error: 'Invalid message format' }) + '\n');
    }
  });

  socket.on('close', () => {
    console.log('Connection closed');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
  });

// Lancer le serveur TCP sur un port spécifique
  tcpServer.listen(3006, '192.168.252.216', () => {
    console.log('Custom TCP server is listening on port 3004');
  });

    // Synchronisation des microservices
    await app.startAllMicroservices();
    console.log('Gateway connecté aux microservices via TCP');

    const corsOptions = {
      origin: "*",
      credentials: true,
      methods:"*",
      allowedHeaders: 'Content-Type,Authorization',
    };
  
    app.enableCors(corsOptions)
    // Serveur HTTP du Gateway
    await app.listen(3003);
    console.log('Gateway HTTP disponible sur http://127.0.0.1:3003');
}
bootstrap();
