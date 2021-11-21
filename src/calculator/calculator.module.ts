import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { KickboardsModule } from '../kickboards/kickboards.module';
import { AreaModule } from '../area/area.module';
import { RegularPolicesModule } from '../regular-policies/regular-policies.module';
import { ForbiddenAreaModule } from '../forbidden-area/forbidden-area.module';
import { DiscountPenaltyInfoModule } from 'src/discount-penalty-info/discount-penalty-info.module';
import { ParkingZoneModule } from 'src/parking-zone/parking-zone.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CalculatorController],
  imports: [
    KickboardsModule,
    AreaModule,
    UsersModule,
    RegularPolicesModule,
    ForbiddenAreaModule,
    DiscountPenaltyInfoModule,
    ParkingZoneModule
  ],
  providers: [CalculatorService],
})
export class CalculatorModule { }
