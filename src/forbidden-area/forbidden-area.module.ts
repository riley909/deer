import { Module } from '@nestjs/common';
import { ForbiddenAreaService } from './forbidden-area.service';

@Module({
  providers: [ForbiddenAreaService],
  exports: [ForbiddenAreaService],
})
export class ForbiddenAreaModule {}
