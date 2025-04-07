import { Controller, Get, Post, Body, Query, Param, UsePipes, ValidationPipe, BadRequestException, Patch, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards, Request, Req, NotFoundException, Res, ConflictException, HttpStatus, InternalServerErrorException, HttpException } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreatedataDto } from './dto/create-gateway.dto';
import { CreateUserDto } from './dto/create-uset.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';


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
    
    try {
      console.log("je suis ici",req.user);
    
      const command = `create_${moduleName}`;
      let data = {
        serviceName:serviceName,
        moduleName: command,
        data:payload,
        method:'POST',
        serviceSource:'0'
      }
      console.log("les create ",data);
      const { user, roleId } = req.user;
      return await this.gatewayService.serviceCommunication(data);
    } catch (error) {
      console.log("erreur", error);

      // Si c’est déjà une HttpException (comme BadRequestException), on la relance telle quelle
      if (error instanceof HttpException) {
        throw error;
      }

      // Si ce n’est pas une HttpException, on retourne une erreur serveur générique
      throw new InternalServerErrorException("Une erreur inattendue est survenue.");

    }

  }

 
  @Get('/:id')
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
    return this.gatewayService.serviceCommunication(data);
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
    console.log('mes data:', data);
    
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
    @Body() body:any,
    @Res() res: Response,
  ) {
    console.log("le body de update:",body);
    
    const command = `update_${moduleName}`;
    let data = {
      serviceName:serviceName,
      moduleName: command,
      data:body,
      method:'PATCH',
      serviceSource:'0'
    }
    console.log('========================================================mes data:', data);
    try {
      const { userId, roleId } = req.user;
      // recupere les information de l'utilisateur aupres du service authentification
      const result = await this.gatewayService.serviceCommunication(data);

      if (!result) {
        throw new NotFoundException(HttpStatus.NOT_FOUND)
      }
      console.log(Date.now(), result);
      
      return result
    } catch (error) {
      throw new Error(error)
    }
   
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
    @Body() loginDto:LoginUserDto,
    @Res() res: Response,
  )
   {
    const command = `login_${moduleName}`;
    console.log(loginDto);
    
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
      console.log("data:",user);

      if (!user) {
        throw new Error("utilisateur non trouve")
      }
      console.log("on users:", user);
      
      const payload = { token:user.token, status:user.status, user : user.user};
      return res.json(payload)
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
    @Res() res: Response,
    @Body() body:CreateUserDto
  
  ) {
    

    try {
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
      return res.json({token})
    } catch (error) {
      throw new Error(`Erreur HTTP : ${error.status} ${error}`);

    }

  
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
    
    // recupere les information de l'utilisateur aupres du service authentification
    try {
      const token= await this.gatewayService.serviceCommunication(data);
      return { message: "Email vérifié avec succès !" }
    } catch (error) {
      if (error.statusCode===409) {
      throw new ConflictException(error)
      }
      throw new ConflictException(error)
    }
  }
}
