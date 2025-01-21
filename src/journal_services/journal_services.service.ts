import { ConflictException, Injectable } from '@nestjs/common';
import { CreateJournalServiceDto } from './dto/create-journal_service.dto';
import { UpdateJournalServiceDto } from './dto/update-journal_service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalServices } from './entities/journal_service.entity';
import { Repository } from 'typeorm';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';

@Injectable()
export class JournalServicesService {

  constructor(
     @InjectRepository(JournalServices)
        private readonly journalServicesRepository: Repository<JournalServices>,
  ){}


  async create(createJournalServiceDto: CreateJournalServiceDto) {
console.log('creation du journal',createJournalServiceDto);

    try {
      const journal = await this.journalServicesRepository.create({
        serviceSource: createJournalServiceDto.serviceSource,
        serviceCible: createJournalServiceDto.serviceCible,
        statut:createJournalServiceDto.statut,
        tempsReponse: createJournalServiceDto.tempsReponse,
      });
      return this.journalServicesRepository.save(journal)
    } catch (error) {
      throw new ConflictException( `erreur du journal service ${error}`)
    }
  }

  findAll() {
    return `This action returns all journalServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} journalService`;
  }

  update(id: number, updateJournalServiceDto: UpdateJournalServiceDto) {
    return `This action updates a #${id} journalService`;
  }

  remove(id: number) {
    return `This action removes a #${id} journalService`;
  }
}
