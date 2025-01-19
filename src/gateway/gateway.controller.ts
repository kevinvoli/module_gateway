import { Controller, Get, Post, Body, Query, Param, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreatedataDto } from './dto/create-gateway.dto';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

@UsePipes(new ValidationPipe({
  transform: true, // Cela transforme les objets bruts en instances de DTO
  whitelist: true, // Cela supprime les propriétés non définies dans le DTO
  forbidNonWhitelisted: true, 
  exceptionFactory: (errors) =>{
  const formattedErrors = errors.map((err) => ({
    property: err.property,
    constraints: err.constraints,
  }));
  return new RpcException(formattedErrors);
  
}}))
  @MessagePattern({cmd:'process_data'}) // Pattern du message attendu
  async processData(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `create_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.forwardRequest(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  @Post('call')
  async callService(
    @Body() body: CreatedataDto
  ) {
    console.log("ici le body",body);
   
    try {
      return this.gatewayService.forwardRequest(
        body
      );
    } catch (error) {
      return { success: false, message: error.message };
    }
   
  }
  
    @Post(':service/:module/create')
    async create(
      @Param('service') serviceName: string,
      @Param('module') moduleName: string,
      @Body() payload: any,
    ) {
      const command = `create_${moduleName}`;
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:payload,
        method:'POST',
        serviceSource:'0'
      }
      
      return this.gatewayService.forwardRequest(data);
    }
  
    @Get(':service/:module/:id')
    async findOne(
      @Param('service') serviceName: string,
      @Param('module') moduleName: string,
      @Param('id') id: number,
    ) {
      const command = `findOne_${moduleName}`;
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:id,
        method:'GET',
        serviceSource:'0'
      }
      return this.gatewayService.forwardRequest(data);
    }
  
    @Get()    
    async find(
      @Query('service') serviceName: string,
      @Query('module') moduleName: string,
    ) {
      const command = `findAll_${moduleName}`;
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:null,
        method:'GET',
        serviceSource:'0'
      }
      console.log("ma route service passe:",command,serviceName);
      return this.gatewayService.forwardRequest(data);
    }
}
