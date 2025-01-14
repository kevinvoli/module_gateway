import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../discovery/entities/service.entity';
// import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JournalServices } from 'src/journal_services/entities/journal_service.entity';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { DiscoveryService } from '@nestjs/core';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';
import { JournalServicesService } from 'src/journal_services/journal_services.service';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    private readonly journalServices: JournalServicesService,
    private readonly discoveryService : ServiceDiscoveryService,
  ) {}

  async createTcpClient(host: string, port: number) {
    try {
      return ClientProxyFactory.create({transport: Transport.TCP,options: { host, port }});
    } catch (error) {
      throw new NotFoundException("connection impossible")
    }
  }
  // Route une requête dynamique vers un microservice.
  async forwardRequest(serviceName: string,command:string,data?: any) {

    const service = await this.discoveryService.getService(serviceName);
    if (!service) {
      throw new NotFoundException(`Service ${serviceName} non trouvé`);
    }
      
    const startTime = Date.now();
    const client =await this.createTcpClient( service.host,parseInt(service.port) );
    try {
      const response =  await firstValueFrom(client.send({cmd:command},data? data:{}))
          // Journalise la requête réussie
          await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'SUCCESS',tempsReponse:`${Date.now()- startTime}`,});
      return response;
       } catch (error) {
        
      // Journalise l'échec
      await this.journalServices.create({serviceSource: null,serviceCible: service.id,statut:'FAILED',tempsReponse:`${Date.now()- startTime}`,});

         throw new NotFoundException( `Erreur lors de la communication avec le service ${serviceName}: ${error}`,)
       }finally{
         client.close()
       }  
  }

  /**
   * Récupère tous les services enregistrés.
   */
  async getAllServices(): Promise<Services[]> {
    return this.servicesRepository.find();
  }
}
