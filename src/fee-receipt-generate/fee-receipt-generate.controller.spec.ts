import { Test, TestingModule } from '@nestjs/testing';
import { FeeReceiptGenerateController } from './fee-receipt-generate.controller';
import { FeeReceiptGenerateService } from './fee-receipt-generate.service';

describe('FeeReceiptGenerateController', () => {
  let controller: FeeReceiptGenerateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeReceiptGenerateController],
      providers: [FeeReceiptGenerateService],
    }).compile();

    controller = module.get<FeeReceiptGenerateController>(FeeReceiptGenerateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
