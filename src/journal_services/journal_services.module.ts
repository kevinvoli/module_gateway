import { Module } from '@nestjs/common';
import { JournalServicesService } from './journal_services.service';
import { JournalServicesController } from './journal_services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalServices } from './entities/journal_service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([JournalServices])],
  
  controllers: [JournalServicesController],
  providers: [JournalServicesService],
})
export class JournalServicesModule {}
