import { Controller,
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Logger, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  HttpStatus, 
  Req, 
  Res, 
  Options, 
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Delete('delete')
  async deleteAccount(){
    return "succes to delete"
  }
}