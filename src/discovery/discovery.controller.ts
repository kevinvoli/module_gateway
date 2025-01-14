import { Body, Controller, Param, Post } from "@nestjs/common";
import { ServiceDiscoveryService } from "./discovery.service";

@Controller('discovery')
export class ServiceDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) {}

  @Post('register')
  async registerService(
    @Body() body: { 
      name: string; 
      host: string;
      port: string; 
      apiKey?: string; 
      protocole?:string}) {
    console.log('registre dans discoverie');
    
    return this.serviceDiscoveryService.registerService(body.name, body.host,body.port, body.apiKey, body.protocole);
  }

  @Post('service/:nom')
  async findOneService(
    @Param('name') name : string
  ) {
    return this.serviceDiscoveryService.getService(name);
  }

  @Post('service/')
  async findService(
  ) {
    return this.serviceDiscoveryService.getAllService();
  }
}
  
  