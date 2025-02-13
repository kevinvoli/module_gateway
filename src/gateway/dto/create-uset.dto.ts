import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @Length(5,30)
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  @Length(1,50)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3,30)
  name: string ;

}


