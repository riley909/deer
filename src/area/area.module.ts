import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  exports: [AreaService],
  providers: [AreaService],
})
export class AreaModule {}
