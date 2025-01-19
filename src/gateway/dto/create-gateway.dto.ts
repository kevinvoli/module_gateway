import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreatedataDto {

  @IsNotEmpty()
  @IsString()
  serviceName:string;

  @IsString()
  @IsNotEmpty()
  moduleName:string;

  
  @IsNotEmpty()
  @IsArray()
  data:{}|null;

  @IsString()
  @IsNotEmpty()
  method:string;

  @IsString()
  @IsNotEmpty()
  serviceSource:string;
}
