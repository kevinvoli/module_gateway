import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalServices } from 'src/journal_services/entities/journal_service.entity';
import { Services } from 'src/discovery/entities/service.entity';
import { JournalServicesService } from 'src/journal_services/journal_services.service';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services, JournalServices])],
  controllers: [GatewayController],
  providers: [GatewayService, JournalServicesService,ServiceDiscoveryService],
})
export class GatewayModule {}
