import { Injectable } from '@nestjs/common';
import { KickboardsService } from '../kickboards/kickboards.service';
import { UseDto } from './use.dto';
import { AreaService } from '../area/area.service';
import { RegularPoliciesService } from '../regular-policies/regular-policies.service';
import { ForbiddenAreaService } from '../forbidden-area/forbidden-area.service';
import { DiscountPenaltyInfoService } from '../discount-penalty-info/discount-penalty-info.service';
import { ParkingZoneService } from 'src/parking-zone/parking-zone.service';
import { PriceDetail } from './priceDetail.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CalculatorService {
  constructor(
    private readonly kickboardsService: KickboardsService,
    private readonly areaService: AreaService,
    private readonly userService: UsersService,
    private readonly regularPoliciesService: RegularPoliciesService,
    private readonly discountPenaltyInfoService: DiscountPenaltyInfoService,
    private readonly parkingZoneService: ParkingZoneService,
    private readonly forbiddenAreaService: ForbiddenAreaService,
  ) { }


  async calculateRate(use: UseDto): Promise<any> {

    let details: PriceDetail[] = [];

    //todo Kickboard의 유효성 및 Area ID 반환
    const areaId = await this.kickboardsService.validationAndReturnAreaInfo(
      use.useDeerName,
    );

    //todo 지역의 유효성 및 지역 Entity 반환
    const area = await this.areaService.validationAndReturnArea(areaId);

    //todo User의 유효성 및 User Entity 반환
    let user = await this.userService.findOne(
      use.useUserId,
    );

    //todo 이용시간 계산
    const usedTime = await this.discountPenaltyInfoService.calculateUsedTime(use.useStartAt, use.useEndAt);

    //todo 지역 아이디를 기반으로 해당 지역의 기본요금을 계산
    const regularRate = await this.regularPoliciesService.calculateRegularRate(
      area.id,
      usedTime,
    );

    details.push({
      type: 'basic',
      policy: '기본요금',
      price: regularRate.basic
    })
    details.push({
      type: 'basic',
      policy: '분당요금',
      price: regularRate.ratePerMinute
    })

    // 지역 폴리곤 벗어났는지 확인. 지역 안이면 true
    const outOfRange = await this.areaService.checkOutOfRange(
      use.useEndLat,
      use.useEndLng,
    );

    // 금지구역에 있는지 확인. 금지구역 안이면 true
    const checkInsideForbiddenArea =
      await this.forbiddenAreaService.checkInsideForbiddenArea(
        use.useEndLat,
        use.useEndLng,
      );

    // 파킹존에 있는지 확인. 파킹존 안이면 true
    const checkInsideParkingZone =
      await this.parkingZoneService.exists(
        use.useEndLat,
        use.useEndLng,
      );

    //할인과 벌금 적용
    const discountPenalty = await this.discountPenaltyInfoService.calculateDiscountPenalty(user, area, use, regularRate, outOfRange, checkInsideForbiddenArea, checkInsideParkingZone);
    details = details.concat(discountPenalty.details);

    // 마지막 사용시간 업데이트
    if (areaId && area && user) {
      user.lastUsed = use.useEndAt;
      await this.userService.updateLastUsed(user);
    }

    return {
      details,
      totalPrice: discountPenalty.totalPrice
    };
  }
}
