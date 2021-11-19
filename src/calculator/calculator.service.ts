import { Injectable } from '@nestjs/common';
import { KickboardsService } from '../kickboards/kickboards.service';
import { UseDto } from './use.dto';
import { AreaService } from '../area/area.service';
import { RegularPoliciesService } from '../regular-policies/regular-policies.service';
import { ForbiddenAreaService } from '../forbidden-area/forbidden-area.service';

@Injectable()
export class CalculatorService {
  constructor(
    private readonly kickboardsService: KickboardsService,
    private readonly areaService: AreaService,
    private readonly regularPoliciesService: RegularPoliciesService,
    private readonly forbiddenAreaService: ForbiddenAreaService,
  ) {}
  calculateRate(use: UseDto): any {
    //todo Kickboard의 유효성 및 Area ID 반환
    const areaId = this.kickboardsService.validationAndReturnAreaInfo(
      use.useDeerName,
    );
    //todo 지역의 유효성 및 지역 Entity 반환
    const area = this.areaService.validationAndReturnArea(areaId);
    //todo 이용시간 계산
    const usedTime = this.calculateUsedTime(use.useStartAt, use.useEndAt);
    //todo 지역 아이디를 기반으로 해당 지역의 기본요금을 계산
    const regularRate = this.regularPoliciesService.calculateRegularRate(
      areaId,
      usedTime,
    );
    //todo 지역 폴리곤 벗어났는지 확인. area.service 로 이동. 안 = true 바깥 = false 반환
    const outOfRange = this.areaService.checkOutOfRange(
      use.useEndLat,
      use.useEndLng,
    );
    // outOfRange == false 일때 바깥으로 부터 몇 m 떨어져있는지 확인하는 메소드.
    // -> ForbiddenService 의 outsideDistance(area, use.useEndLat, use.useEndLng);
    // todo 금지구역에 있는지 확인 outOfRange == true
    const checkInsideForbiddenArea =
      this.forbiddenAreaService.checkInsideForbiddenArea(
        areaId,
        use.useEndLat,
        use.useEndLng,
      );

    return regularRate;
  }

  // 이용시간 계산 유틸리티 메서드
  calculateUsedTime(startDateTime: Date, endDateTime: Date): number {
    const diff = startDateTime.getTime() - endDateTime.getTime();
    const min = Math.floor(diff / 1000 / 60);
    return min;
  }
}
