import { Controller, Get, Post, Body, Query, Param, UsePipes, ValidationPipe, BadRequestException, Patch, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards, Request, Req, NotFoundException } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreatedataDto } from './dto/create-gateway.dto';
import { CreateUserDto } from './dto/create-uset.dto';
import { LoginUserDto } from './dto/login-user.dto';


@Controller('gateway')
@UsePipes(new ValidationPipe(
{  transform: true, // Cela transforme les objets bruts en instances de DTO
  whitelist: true, // Cela supprime les propriétés non définies dans le DTO
  forbidNonWhitelisted: true,

}
))
export class GatewayController {

  constructor(private readonly gatewayService: GatewayService,) {}

 
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
  
}
}))

  @MessagePattern({cmd:'process_data'}) // Pattern du message attendu
  async processData(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `create_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.serviceCommunication(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  @MessagePattern({cmd:'findAll'}) // Pattern du message attendu
  async finds(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `findAll_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.serviceCommunication(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  @MessagePattern({cmd:'create'}) // Pattern du message attendu
  async creates(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `create_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.serviceCommunication(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  @MessagePattern({cmd:'update'}) // Pattern du message attendu
  async updates(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `create_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.serviceCommunication(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  @MessagePattern({cmd:'remove'}) // Pattern du message attendu
  async removes(data: CreatedataDto) {
    try {
    console.log("niveau ddd gateway",data);
    const command = `create_${data.moduleName}`;
    data.moduleName = command
      return this.gatewayService.serviceCommunication(
        data
      );
    } catch (error) {
      console.log("leserrue",error);
      
      return { success: false, message: error.message };
    }
  }

  
  @Post('create')
  async create(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Req() req,
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
    const { userId, roleId } = req.user;
    return this.gatewayService.forwardRequest(data, { userId, roleId });
  }

 
  @Get('/:')
  async findOne(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Param('id') id: number,
    @Request() req,
  ) {
    console.log("findone data:", req.user);

    const command = `findOne_${moduleName}`;
    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:id,
      method:'GET',
      serviceSource:'0'
    }
    console.log("findone data:", req.user);
    
    const { userId, roleId } = req.user;
    return this.gatewayService.forwardRequest(data,{ userId, roleId });
  }


  @Get()    
  async find(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Request() req,
  ) {
    console.log('mes data:', req.user);

    try {
      const command = `findAll_${moduleName}`;
    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:null,
      method:'GET',
      serviceSource:'0'
    }
    console.log('mes data:', req.user);
    
    const userId = req.user?.id;
    const roleId = req.user?.roleId;

    return await this.gatewayService.forwardRequest(data,req.user);
    } catch (error) {
      throw new NotFoundException(error);
    }
    
    
  }


  @Patch(':id')
  async update(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Param('id') id: string, 
    @Request() req,
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
    const { userId, roleId } = req.user;
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data,{ userId, roleId });
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return "update"
  }

 
  @Delete('delete/:id')
  async remove(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Param('id') id: string,
    @Request() req,
  ) {

    const command = `remove_${moduleName}`;

    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:id,
      method:'GET',
      serviceSource:'0'
    }
    const { userId, roleId } = req.user;
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data,{ userId, roleId });
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return "remove"
  }

  @Post('login')
  async login(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Body() loginDto:LoginUserDto
  )
   {
    const command = `login_${moduleName}`;

    try {
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:loginDto,
        method:'GET',
        serviceSource:'0'
      }
      console.log("data:",data);
      // recupere les information de l'utilisateur aupres du service authentification
      const user= await this.gatewayService.serviceCommunication(data);
      if (!user) {
        throw new Error("utilisateur non trouve")
      }

      const payload = { email: user?.email, roles: ['admin'],userId:user?.id };
      return user;
    } catch (error) {
      throw new Error(error)
    }
    
  }


  @Post('validate-token')
  async validateToken(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Request() req,
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
    const { userId, roleId } = req.user;
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.forwardRequest(data,{ userId, roleId });
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    // return this.authService.validateToken(token);
  }

  @Post('create_user')
  async createUser(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Body() body:CreateUserDto
  
  ) {
    console.log("mes data",body);
    
    const command = `create_${moduleName}`;
    console.log('create:', command);
    

    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:body,
      method:'GET',
      serviceSource:'0'
    }
    console.log("les date:", data);
    
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.serviceCommunication(data);
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return token
  }

  @Get('confirmation')
  async comfirmation(
    @Query('service') serviceName: string,
    @Query('module') moduleName: string,
    @Query('token') tokens: string,

  
  ) {
    const command = `confirmation_${moduleName}`;
    console.log("dfvdcs");
    
    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:{tokens},
      method:'GET',
      serviceSource:'0'
    }
    console.log("les date:", data);
    
    // recupere les information de l'utilisateur aupres du service authentification
    const token= await this.gatewayService.serviceCommunication(data);
    if (!token) {
      throw new Error("utilisateur non trouve")
    }
    return token
  }
}
