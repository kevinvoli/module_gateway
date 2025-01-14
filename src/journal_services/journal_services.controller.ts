import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JournalServicesService } from './journal_services.service';
import { CreateJournalServiceDto } from './dto/create-journal_service.dto';
import { UpdateJournalServiceDto } from './dto/update-journal_service.dto';

@Controller('journal-services')
export class JournalServicesController {
  constructor(private readonly journalServicesService: JournalServicesService) {}

  @Post()
  create(@Body() createJournalServiceDto: CreateJournalServiceDto) {
    return this.journalServicesService.create(createJournalServiceDto);
  }

  @Get()
  findAll() {
    return this.journalServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJournalServiceDto: UpdateJournalServiceDto) {
    return this.journalServicesService.update(+id, updateJournalServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalServicesService.remove(+id);
  }
}
