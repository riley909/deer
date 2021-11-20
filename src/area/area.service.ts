import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async validationAndReturnArea(areaId: string): Promise<Area> {
    //todo 지역의 유효성 검증 (유효하지 않을 경우 throw error)
    //todo 지역 entity 를 반환
    const areaEntity = await this.findOne(areaId);
    if (areaEntity.length) {
      return areaEntity;
    } else {
      throw new NotFoundException(`"${areaId}"가 존재하지 않습니다.`);
    }
  }

  //todo 사용자 이용의 위도, 경도가 지역의 폴리곤 범위를 벗어나는지 확인하는 메서드
  async checkOutOfRange(
    useEndLat: number,
    useEndLng: number,
  ): Promise<boolean> {
    //todo 범위 확인 로직
    const qPoint = `'POINT (${useEndLat} ${useEndLng})'`;
    const query = ` SELECT id FROM area 
                    WHERE ST_CONTAINS( area_boundary, ST_GeomFromText( ${qPoint} ))`;
    const result = await this.areaRepository.query(query);
    console.log(result.length);
    if (result.length) {
      return true; // 벗어나지 않음. 범위 안!
    } else {
      return false; // 벗어남. 범위 바깥!!
    }
  }

  async findOne(areaId: string) {
    const query = `SELECT id, ST_AsText(area_boundary), ST_AsText(area_center), ST_AsText(area_coords) as area_coords FROM area WHERE id = ${areaId}`;
    const areaEntity = await this.areaRepository.query(query);
    return areaEntity;
  }
}
