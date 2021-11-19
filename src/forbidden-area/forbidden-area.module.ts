import { Module } from '@nestjs/common';
import { ForbiddenAreaService } from './forbidden-area.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from '../area/area.entity';
import { ForbiddenArea } from './forbidden-area.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    TypeOrmModule.forFeature([ForbiddenArea]),
  ],
  exports: [ForbiddenAreaService],
  providers: [ForbiddenAreaService],
})
export class ForbiddenAreaModule {}
