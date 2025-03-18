import { ConflictException, Injectable, Next, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../discovery/entities/service.entity';
import { firstValueFrom } from 'rxjs';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';
import { JournalServicesService } from 'src/journal_services/journal_services.service';
import { CreatedataDto } from './dto/create-gateway.dto';
import { permission } from 'process';
import { error } from 'console';

@Injectable()
export class GatewayService {
  constructor(
    private readonly journalServices: JournalServicesService,
    private readonly discoveryService : ServiceDiscoveryService,
  ) {}

  private  async createTcpClient(host: string, port: number) {
    console.log("connect tcp:", host, port);
    
    try {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host, port }});
    } catch (error) {
      console.log("eereur de communication:",error);
      
      throw new NotFoundException("connection impossible")
    }
  }

  async login(){
    
  }
  // Route une requête dynamique vers un microservice.
  // {serviceName: string,command:string,data?: any}
  async forwardRequest(data:CreatedataDto,users) {
    const {user,permission} = users
    console.log("mes user:", users);
    
    const service = await this.discoveryService.getService(data.serviceName);
    if (!service) {
      throw new NotFoundException(`Service ${data.serviceName} non trouvé`);
    }
      // console.log("mes servcie",service);
      
    const startTime = Date.now();
    const client =await this.createTcpClient( service.host,parseInt(service.port) );
    try {
      const response =  await firstValueFrom(client.send({cmd:data.moduleName},{user:{user,permission}, data: data.data? data.data:{}}))
          // Journalise la requête réussie
          await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
          console.log("la reponse:tok", response);
          
      return response;
       } catch (error) {
        
      // Journalise l'échec
      await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'FAILED',tempsReponse:`${Date.now()- startTime}`,});

         throw new NotFoundException( `Erreur lors de la communication avec le service ${data.serviceName}: ${error[1]}`,)
       }finally{
         client.close()
       }  
  }


  async serviceCommunication(data:CreatedataDto) {
   
    const service = await this.discoveryService.getService(data.serviceName);
    if (!service) {
      throw new NotFoundException(`Service ${data.serviceName} non trouvé`);
    }
      // console.log("mes servcie",service);
      
    const startTime = Date.now();
    const client =await this.createTcpClient( service.host,parseInt(service.port) );
    
    try {
      const response =  await firstValueFrom(client.send({cmd:data.moduleName}, data.data? data.data:{}))
          // Journalise la requête réussie
        console.log("l'response returne par le service:",response);
          
          await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
          
      return response;
       } catch (error) {
        console.warn(error)
        
      // Journalise l'échec
      await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:error.status,tempsReponse:`${Date.now()- startTime}`,});
        if (error.status===409) {
          throw new ConflictException(error?.message)
        }
         throw new Error(error)
       }finally{
         client.close()
       }  
  }

}
