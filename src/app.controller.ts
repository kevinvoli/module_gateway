import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  private stockServiceClient: ClientProxy;

  constructor(private readonly appService: AppService) {}
  
  private createTCPClient(host: string, port: number) {
    try {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host,
          port,
        },
      });
    } catch (error) {
        throw new Error(`echec de connection au service :${error} `);      
    }
  }

  @Get()
  async getHello() {
    console.log("Sending message to FastAPI via TCP...");
    
    try { 
      const data = { key: 'value' };
      const client = await this.createTCPClient('192.168.183.153', 3000); 
      const response = await firstValueFrom(client.send({ cmd: 'process_data' }, data ? data : {}));
      console.log('Response from FastAPI:', response);
      return response;
    } catch (error) {
      console.error('Error communicating with FastAPI:', error.message);
      throw error;
    }
  }
}