import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Next, NotFoundException } from '@nestjs/common';
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
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",data);
    
    
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
         
          
      return response;
       } catch (error) {
        console.error("Erreur capturée :", error);

    await this.journalServices.create({
      serviceSource: null,
      serviceCible: service.id,
      statut: 'FAILED',
      tempsReponse: `${Date.now() - startTime}`,
    });

    // ✅ Si l'erreur est déjà une exception NestJS, la relancer
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    // ✅ Gestion des erreurs de validation retournées par un microservice
    if (Array.isArray(error) && error[0]?.constraints) {
      const formattedErrors = error.map((e) => ({
        property: e.property,
        messages: Object.values(e.constraints),
      }));

      throw new BadRequestException({
        message: "Validation échouée",
        errors: formattedErrors,
      });
    }

    // ✅ Si l’erreur est une chaîne ou un objet message
    if (typeof error === 'string') {
      throw new InternalServerErrorException(error);
    }

    if (typeof error?.message === 'string') {
      throw new InternalServerErrorException(error.message);
    }

    // ✅ Fallback
    throw new InternalServerErrorException("Une erreur inattendue est survenue.");
       }finally{
         client.close()
       }  
  }


  async serviceCommunication(data:CreatedataDto) {
   
    const service = await this.discoveryService.getService(data.serviceName);
    if (!service) {
      throw new NotFoundException(`Service ${data.serviceName} non trouvé`);
    }
      console.log("mes servcie",service);
      
    const startTime = Date.now();
    const client =await this.createTcpClient( service.host,parseInt(service.port) );
    
    try {
      const response =  await firstValueFrom(client.send({cmd:data.moduleName}, data.data? data.data:{}))
          // Journalise la requête réussie
        // console.log("l'response returne par le service:",response);
          
          await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
          
      return response;
       } catch (error) {
        // console.error("Erreur capturée :", error);

        await this.journalServices.create({
          serviceSource: null,
          serviceCible: service.id,
          statut: 'FAILED',
          tempsReponse: `${Date.now() - startTime}`,
        });
    
        // ✅ Si l'erreur est déjà une exception NestJS, la relancer
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        }
    
        // ✅ Gestion des erreurs de validation retournées par un microservice
        if (Array.isArray(error) && error[0]?.constraints) {
          const formattedErrors = error.map((e) => ({
            property: e.property,
            messages: Object.values(e.constraints),
          }));
    
          throw new BadRequestException({
            message: "Validation échouée",
            errors: formattedErrors,
          });
        }
    
        // ✅ Si l’erreur est une chaîne ou un objet message
        if (typeof error === 'string') {
          throw new InternalServerErrorException(error);
        }
    
        if (typeof error?.message === 'string') {
          throw new InternalServerErrorException(error.message);
        }
    
        // ✅ Fallback
        throw new InternalServerErrorException("Une erreur inattendue est survenue.");
       }finally{
         client.close()
       }  
  }

}
