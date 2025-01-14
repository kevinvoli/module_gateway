import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Services } from "./entities/service.entity";
import { Repository } from "typeorm";

@Injectable()
export class ServiceDiscoveryService {
  constructor(
    @InjectRepository(Services)
    private readonly serviceRepository: Repository<Services>,
  ) {}

  async registerService(name: string, host: string,port: string, apiKey?: string,protocole?:string) {
    const existingService = await this.serviceRepository.findOne({ where: { nom: name } });

    if (existingService) {
      existingService.host = host;
      existingService.port = port;
      existingService.cleApi = apiKey || existingService.cleApi;
      existingService.protocole = protocole
      // existingService.isActive = true; // Assure que le service est actif
      return this.serviceRepository.save(existingService);
    }

    const newService = this.serviceRepository.create({ nom: name, host,port, cleApi: apiKey });
    return this.serviceRepository.save(newService);
  }

  async getService(name: string) {
    return await this.serviceRepository.findOne({ where: { nom: name } });
  }

  async getAllService() {
    return await this.serviceRepository.find();
  }

}
