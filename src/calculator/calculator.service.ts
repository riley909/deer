import { Injectable } from '@nestjs/common';
import { KickboardsService } from '../kickboards/kickboards.service';
import { UseDto } from './use.dto';
import { AreaService } from '../area/area.service';
import { RegularPoliciesService } from '../regular-policies/regular-policies.service';
import { ForbiddenAreaService } from '../forbidden-area/forbidden-area.service';
import { PenaltyPoliciesService } from '../penalty-policies/penalty-policies.service';

@Injectable()
export class CalculatorService {
  constructor(
    private readonly kickboardsService: KickboardsService,
    private readonly areaService: AreaService,
    private readonly regularPoliciesService: RegularPoliciesService,
    private readonly forbiddenAreaService: ForbiddenAreaService,
    private readonly penaltyPoliciesService: PenaltyPoliciesService,
  ) {}
  async calculateRate(use: UseDto): Promise<any> {
    //todo Kickboard의 유효성 및 Area ID 반환
    const areaId = await this.kickboardsService.validationAndReturnAreaInfo(
      use.useDeerName,
    );

    //todo 지역의 유효성 및 지역 Entity 반환
    const area = await this.areaService.validationAndReturnArea(areaId);

    //todo 이용시간 계산
    const usedTime = this.calculateUsedTime(use.useStartAt, use.useEndAt);

    //todo 지역 아이디를 기반으로 해당 지역의 기본요금을 계산
    const regularRate = await this.regularPoliciesService.calculateRegularRate(
      area.id,
      usedTime,
    );

    //todo 지역 폴리곤 벗어났는지 확인. area.service 로 이동. 안 = true 바깥 = false 반환
    const outOfRange = await this.areaService.checkOutOfRange(
      use.useEndLat,
      use.useEndLng,
    );
    if (outOfRange) {
      // outOfRange == false 일때 바깥으로 부터 몇 m 떨어져있는지 확인하는 메소드.
      // const 몇미터? = this.forbiddenAreaService.outsideDistance(area, use.useEndLat, use.useEndLng);
      //todo 기본요금 + 거리당 벌금
      return '기본요금 + 거리당 벌금 부과';
    }

    // todo 금지구역에 있는지 확인. outOfRange == true
    const checkInsideForbiddenArea =
      await this.forbiddenAreaService.checkInsideForbiddenArea(
        use.useEndLat,
        use.useEndLng,
      );

    //todo 이용정보와 지역정보로 적용되는 패널티의 리스트를 반환한다.
    const penaltyPolicy =
      await this.penaltyPoliciesService.isSatisfiedPenaltyList(areaId);

    return regularRate;
  }

  // 이용시간 계산 유틸리티 메서드
  calculateUsedTime(startDateTime: Date, endDateTime: Date): number {
    const diff = startDateTime.getTime() - endDateTime.getTime();
    const min = Math.floor(diff / 1000 / 60);
    return min;
  }
}
