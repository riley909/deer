import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountPenaltyInfoService } from './discount-penalty-info.service';
import { DiscountPenaltyInfo } from './discount-penalty-info';
import { ForbiddenAreaModule } from 'src/forbidden-area/forbidden-area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountPenaltyInfo]),
    ForbiddenAreaModule,
  ],
  exports: [DiscountPenaltyInfoService],
  providers: [DiscountPenaltyInfoService],
})
export class DiscountPenaltyInfoModule { }
