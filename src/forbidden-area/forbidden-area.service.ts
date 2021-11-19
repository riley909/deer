import { Injectable } from '@nestjs/common';

@Injectable()
export class ForbiddenAreaService {
  checkInsideForbiddenArea(
    areaId: string,
    useEndLat: number,
    useEndLng: number,
  ): boolean {
    //todo 포비든 지역인지 확인 로직
    return true;
  }
}
