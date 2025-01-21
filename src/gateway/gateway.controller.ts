import { Controller, Get, Post, Body, Query, Param, UsePipes, ValidationPipe, BadRequestException, Patch, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreatedataDto } from './dto/create-gateway.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ifError } from 'assert';

@Controller('gateway')
export class GatewayController {

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly authService: AuthService
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
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


@UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
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



  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
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
  

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
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


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
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


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
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


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Param('id') id: string, 
    @Body() body
  ) {
    const command = `findAll_${moduleName}`;

    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:body,
      method:'GET',
      serviceSource:'0'
    }
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data);
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return "update"
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async remove(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Param('id') id: string
  ) {

    const command = `findAll_${moduleName}`;

    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:id,
      method:'GET',
      serviceSource:'0'
    }
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data);
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return "remove"
  }

  
  @Post('login')
  async login(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Body() loginDto: { email: string; password: string }
  ) {
    const command = `findAll_${moduleName}`;

    try {
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:loginDto,
        method:'GET',
        serviceSource:'0'
      }
      // recupere les information de l'utilisateur aupres du service authentification
      const user= await this.gatewayService.forwardRequest(data);
      if (!user) {
        throw new Error("utilisateur non trouve")
      }

      const payload = { email: user?.email, roles: ['admin'],userId:user?.id };
      return this.authService.login(payload);
    } catch (error) {
      throw new Error(error)
    }
    
  }

  
  @Post('validate-token')
  async validateToken(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Body() body: { token: string }
  
  ) {
    const command = `findAll_${moduleName}`;

    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:body,
      method:'GET',
      serviceSource:'0'
    }
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data);
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return this.authService.validateToken(token);
  }
}
