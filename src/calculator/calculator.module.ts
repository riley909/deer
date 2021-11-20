import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { KickboardsModule } from '../kickboards/kickboards.module';
import { AreaModule } from '../area/area.module';
import { RegularPolicesModule } from '../regular-policies/regular-policies.module';
import { ForbiddenAreaModule } from '../forbidden-area/forbidden-area.module';

@Module({
  controllers: [CalculatorController],
  imports: [
    KickboardsModule,
    AreaModule,
    RegularPolicesModule,
    ForbiddenAreaModule,
  ],
  providers: [CalculatorService],
})
export class CalculatorModule {}
