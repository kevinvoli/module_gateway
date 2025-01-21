import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalServices } from 'src/journal_services/entities/journal_service.entity';
import { Services } from 'src/discovery/entities/service.entity';
import { JournalServicesService } from 'src/journal_services/journal_services.service';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/entities/token.entity';
import { Roles } from 'src/auth/entities/roles.entity';
import { TokenService } from 'src/auth/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    Services,
    JournalServices,
    Token,
    Roles,

  ])],
  controllers: [GatewayController],
  providers: [
    GatewayService, 
    JournalServicesService,
    ServiceDiscoveryService,
    AuthService,
    TokenService,
    JwtService,
    ConfigService

   ],
})
export class GatewayModule {}
