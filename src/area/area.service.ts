import { Injectable } from '@nestjs/common';
import { Area } from './area.entity';

@Injectable()
export class AreaService {
  validationAndReturnArea(areaId: string): Area {
    //todo 지역의 유효성 검증 (유효하지 않을 경우 throw error)
    //todo 지역 entity를 반환
    return {} as Area;
  }
}
