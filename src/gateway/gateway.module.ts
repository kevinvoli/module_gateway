import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalServices } from 'src/journal_services/entities/journal_service.entity';
import { Services } from 'src/discovery/entities/service.entity';
import { JournalServicesService } from 'src/journal_services/journal_services.service';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';
import { ConfigService } from '@nestjs/config';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    Services,
    JournalServices,

  ])],
  controllers: [
    GatewayController
  ],
  providers: [
    GatewayService, 
    JournalServicesService,
    ServiceDiscoveryService,
    ConfigService

   ],
})
export class GatewayModule {}
