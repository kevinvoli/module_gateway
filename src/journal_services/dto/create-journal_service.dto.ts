import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateJournalServiceDto {

  @IsNotEmpty()
  @IsNumber()
  serviceSource: number | null;

  @IsNotEmpty()
  @IsNumber()
  serviceCible: number | null;
  
  @IsNotEmpty()
  @IsString()
  statut: string | null;
  
  @IsNotEmpty()
  @IsString()
  tempsReponse: string | null;
   
}
