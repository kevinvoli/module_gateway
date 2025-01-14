import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
 
  @Post('call')
  async callService(
    @Body() body: { serviceName: string; path: string; method: string; data?: any },
  ) {
    console.log("ici le body",body);
   
    try {
      return this.gatewayService.forwardRequest(
        body.serviceName,
        'handle_message',
        body.data,
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
      
      return this.gatewayService.forwardRequest(serviceName, command, payload);
    }
  
    @Get(':service/:module/:id')
    async findOne(
      @Param('service') serviceName: string,
      @Param('module') moduleName: string,
      @Param('id') id: number,
    ) {
      const command = `findOne_${moduleName}`;
      return this.gatewayService.forwardRequest(serviceName, command, id);
    }
  
    @Get()    
    async find(
      @Query('service') serviceName: string,
      @Query('module') moduleName: string,
    ) {
      const command = `findAll_${moduleName}`;
      console.log("ma route service passe:",command,serviceName);
      return this.gatewayService.forwardRequest(serviceName, command);
    }
}
