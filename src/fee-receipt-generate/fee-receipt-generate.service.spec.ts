import { Test, TestingModule } from '@nestjs/testing';
import { FeeReceiptGenerateService } from './fee-receipt-generate.service';

describe('FeeReceiptGenerateService', () => {
  let service: FeeReceiptGenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeReceiptGenerateService],
    }).compile();

    service = module.get<FeeReceiptGenerateService>(FeeReceiptGenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
