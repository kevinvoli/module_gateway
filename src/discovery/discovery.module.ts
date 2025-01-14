import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './entities/service.entity';
import { ServiceDiscoveryController } from './discovery.controller';
import {ServiceDiscoveryService } from './discovery.service';
// import { DiscoveryController } from './discovery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  controllers: [ServiceDiscoveryController],
  providers: [ServiceDiscoveryService],
})
export class DiscoveryModule {}
