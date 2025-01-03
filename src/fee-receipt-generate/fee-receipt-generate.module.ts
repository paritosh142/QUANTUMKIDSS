import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeReceiptGenerateService } from './fee-receipt-generate.service';

import { FeeReceiptGenerate } from './entities/fee-receipt-generate.entity';
import { FeeReceiptGenerateController } from './fee-receipt-generate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeReceiptGenerate])], 
  controllers: [FeeReceiptGenerateController],
  providers: [FeeReceiptGenerateService],
})
export class FeeReceiptGenerateModule {}
