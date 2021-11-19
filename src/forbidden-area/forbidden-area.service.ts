import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../area/area.entity';

@Injectable()
export class ForbiddenAreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  // 경계선으로 부터 벗어난 최단거리 반환: area 테이블 사용
  async outsideDistance(
    area,
    useEndLat: number,
    useEndLng: number,
  ): Promise<number> {
    const qPoint = `'POINT (${useEndLat} ${useEndLng})'`;
    const qLinestring = `'${area[0].area_coords}'`;
    const query = ` SELECT ST_DISTANCE( ST_GeomFromText( ${qPoint}), ST_GeomFromText( ${qLinestring})) AS DISTANCE `;
    const result = await this.areaRepository.query(query);
    const t_distance = result[0].DISTANCE * 100000;
    const distance = Math.round(t_distance); // 정수로 반올림
    return distance;
  }

  // 금지구역안에 있는지 확인: forbidden_area 테이블 사용
  async checkInsideForbiddenArea(
    useEndLat: number,
    useEndLng: number,
  ): Promise<boolean> {
    const qPoint = `'POINT (${useEndLat} ${useEndLng})'`;
    const query = ` SELECT id FROM forbidden_area 
                    WHERE ST_CONTAINS( forbiddenAreaBoundary, ST_GeomFromText( ${qPoint} ))`;
    const result = await this.areaRepository.query(query);
    console.log(result.length);
    if (result.length) {
      return true; // 벗어나지 않음. 범위 안!
    } else {
      return false; // 벗어남. 범위 바깥!!
    }
  }
}
