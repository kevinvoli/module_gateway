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
  data:{}|number |null;

  @IsString()
  @IsNotEmpty()
  method:string;

  @IsString()
  @IsNotEmpty()
  serviceSource:string;
}
