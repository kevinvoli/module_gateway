import { Body, Controller, Param, Post } from "@nestjs/common";
import { ServiceDiscoveryService } from "./discovery.service";
import { CreateDiscoveryDto } from "./dto/create-discovery.dto";

@Controller('discovery')
export class ServiceDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) {}

  @Post('register')
  async registerService(
    @Body() body: CreateDiscoveryDto) {
    console.log('registre dans discoverie');
    try {
      return this.serviceDiscoveryService.registerService(body.nom, body.host,body.port, body.cleApi, body.protocole);
    } catch (error) {
      throw new Error(error)
    }
    
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
  
  