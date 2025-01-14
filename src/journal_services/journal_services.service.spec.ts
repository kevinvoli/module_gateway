import { Test, TestingModule } from '@nestjs/testing';
import { JournalServicesService } from './journal_services.service';

describe('JournalServicesService', () => {
  let service: JournalServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalServicesService],
    }).compile();

    service = module.get<JournalServicesService>(JournalServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
