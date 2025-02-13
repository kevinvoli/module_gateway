import { Injectable, NotFoundException } from '@nestjs/common';
import { JournalServicesService } from './journal_services/journal_services.service';
import { ServiceDiscoveryService } from './discovery/discovery.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreatedataDto } from './gateway/dto/create-gateway.dto';

@Injectable()
export class AppService {
  // constructor(
  //   private readonly journalServices: JournalServicesService,
  //   private readonly discoveryService : ServiceDiscoveryService,
  // ) {}


  //  private  async createTcpClient(host: string, port: number) {
  //     console.log("connect tcp:", host, port);
      
  //     try {
  //       return ClientProxyFactory.create({
  //         transport: Transport.TCP,
  //         options: { host, port }});
  //     } catch (error) {
  //       throw new NotFoundException("connection impossible")
  //     }
  //   }
  
  // async forwardRequest(data:CreatedataDto,users:{userId:any,roleId:any}) {
  //   const {userId, roleId} = users
  //   const service = await this.discoveryService.getService(data.serviceName);
  //   if (!service) {
  //     throw new NotFoundException(`Service ${data.serviceName} non trouvé`);
  //   }
  //     // console.log("mes servcie",service);
      
  //   const startTime = Date.now();
  //   const client =await this.createTcpClient( service.host,parseInt(service.port) );
  //   try {
  //     const response =  await firstValueFrom(client.send({cmd:data.moduleName},{user:{userId,roleId}, data: data.data? data.data:{}}))
  //         // Journalise la requête réussie
  //         await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
  //         console.log("la reponse:tok", response);
          
  //     return response;
  //      } catch (error) {
        
  //     // Journalise l'échec
  //     await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'FAILED',tempsReponse:`${Date.now()- startTime}`,});

  //        throw new NotFoundException( `Erreur lors de la communication avec le service ${data.serviceName}: ${error[1]}`,)
  //      }finally{
  //        client.close()
  //      }  
  // }


  // async serviceCommunication(data:CreatedataDto) {
   
  //   const service = await this.discoveryService.getService(data.serviceName);
  //   if (!service) {
  //     throw new NotFoundException(`Service ${data.serviceName} non trouvé`);
  //   }
  //     // console.log("mes servcie",service);
      
  //   const startTime = Date.now();
  //   const client =await this.createTcpClient( service.host,parseInt(service.port) );
  //   console.log("les client ", client);
    
  //   try {
  //     const response =  await firstValueFrom(client.send({cmd:data.moduleName}, data.data? data.data:{}))
  //         // Journalise la requête réussie
  //         await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
  //         console.log("la reponse:tok", response);
          
  //     return response;
  //      } catch (error) {
        
  //     // Journalise l'échec
  //     await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'FAILED',tempsReponse:`${Date.now()- startTime}`,});

  //        throw new NotFoundException( `Erreur lors de la communication avec le service ${data.serviceName}: ${error[1]}`,)
  //      }finally{
  //        client.close()
  //      }  
  // }

}
