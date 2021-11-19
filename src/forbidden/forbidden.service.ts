import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from '../area/entities/area.entity.ts';
import { Repository } from 'typeorm';

@Injectable()
export class ForbiddenService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  // 경계선으로 부터 벗어난 최단거리 반환
  async outsideDistance(area, useEndLat: number, useEndLng: number): Promise<number> {
    const qPoint = `'POINT (${useEndLat} ${useEndLng})'`;
    const qLinestring = `'${area[0].area_coords}'`;
    const query = ` SELECT ST_DISTANCE( ST_GeomFromText( ${qPoint}), ST_GeomFromText( ${qLinestring})) AS DISTANCE `;
    const result = await this.areaRepository.query(query);
    const t_distance = result[0].DISTANCE * 100000;
    const distance = Math.round(t_distance); // 정수로 반올림
    return distance;
  }
}
