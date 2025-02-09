import { Test, TestingModule } from '@nestjs/testing';
import { ServiceDiscoveryService } from './discovery.service';

describe('DiscoveryService', () => {
  let service: ServiceDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceDiscoveryService],
    }).compile();

    service = module.get<ServiceDiscoveryService>(ServiceDiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
