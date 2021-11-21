import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kickboard } from './kickboard.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KickboardsService {
  constructor(
    @InjectRepository(Kickboard)
    private readonly kickboardRepository: Repository<Kickboard>,
  ) { }

  async validationAndReturnAreaInfo(useDeerName: string): Promise<string> {

    const kickboard = await this.kickboardRepository.query(`
      select kickboard.deer_name, area.id from kickboard inner join area on kickboard.area_id = area.id where kickboard.deer_name = "${useDeerName}";
    `);

    if (!kickboard) {
      throw new NotFoundException(`"${useDeerName}"가 존재하지 않습니다.`);
    }
    return kickboard[0].id;
  }
}
