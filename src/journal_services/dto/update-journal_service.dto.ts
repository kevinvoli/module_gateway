import { PartialType } from '@nestjs/mapped-types';
import { CreateJournalServiceDto } from './create-journal_service.dto';

export class UpdateJournalServiceDto extends PartialType(CreateJournalServiceDto) {}
