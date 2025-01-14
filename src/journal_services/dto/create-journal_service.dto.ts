import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateJournalServiceDto {

 
  @IsNumber()
  serviceSource: number | null;
  @IsNumber()
  serviceCible: number | null;
  
  @IsString()
  statut: string | null;
  
  @IsString()
  tempsReponse: string | null;
   
}
