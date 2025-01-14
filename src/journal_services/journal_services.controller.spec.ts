import { Test, TestingModule } from '@nestjs/testing';
import { JournalServicesController } from './journal_services.controller';
import { JournalServicesService } from './journal_services.service';

describe('JournalServicesController', () => {
  let controller: JournalServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalServicesController],
      providers: [JournalServicesService],
    }).compile();

    controller = module.get<JournalServicesController>(JournalServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
