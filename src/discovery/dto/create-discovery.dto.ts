import { IsNotEmpty, IsString, MaxLength, minLength, MinLength } from "class-validator";

export class CreateDiscoveryDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  host: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  port: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  protocole: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  cleApi: string;
}
