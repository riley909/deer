import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountPenaltyInfo } from './discount-penalty-info';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UseDto } from 'src/calculator/use.dto';
import { ForbiddenAreaService } from 'src/forbidden-area/forbidden-area.service';
import { PriceDetail } from 'src/calculator/priceDetail.dto';
import { User } from 'src/users/user.entity';
import { Area } from '../area/area.entity';

@Injectable()
export class DiscountPenaltyInfoService {
  constructor(
    private readonly forbiddenAreaService: ForbiddenAreaService,

    @InjectRepository(DiscountPenaltyInfo)
    private readonly discountPenaltyInfoRepository: Repository<DiscountPenaltyInfo>,
  ) { }

  async calculateDiscountPenalty(
    user: User,
    area: Area, use: UseDto, regularRate,
    outOfRange: boolean,
    checkInsideForbiddenArea: boolean,
    checkInsideParkingZone: boolean
  ) {


    let discountPenaltyDetails: PriceDetail[] = [];
    let totalPrice = regularRate.basic + regularRate.ratePerMinute;

    let penaltyInfoList = await this.discountPenaltyInfoRepository.find({
      where: [
        { category: 'area', content: area[0].id, type: 'penalty' },
        { category: 'kickboard', content: use.useDeerName, type: 'penalty' },
        { category: 'user', content: user.id, type: 'penalty' },
        { category: 'all', type: 'penalty' },
      ]
    });

    if (checkInsideForbiddenArea) {
      //금지구역인 경우 패널티 먹이고 리턴
      let penaltyInfo = penaltyInfoList.filter((item) => item.policy === 'forbiddenArea');
      let detail = {
        type: 'penalty',
        policy: penaltyInfo[0].policy,
        price: penaltyInfo[0].price
      }
      totalPrice += detail.price;

      return {
        details: [detail],
        totalPrice: totalPrice
      };

    } else if (!outOfRange) {
      // 지역외인 경우 패널티 먹이고 리턴          
      let penaltyInfo = penaltyInfoList.filter((item) => item.policy === 'outOfRange');
      const distance = await this.forbiddenAreaService.outsideDistance(area, use.useEndLat, use.useEndLng);
      let detail = {
        type: 'penalty',
        policy: penaltyInfo[0].policy,
        price: penaltyInfo[0].price * distance
      }

      totalPrice += detail.price;

      return {
        details: [detail],
        totalPrice: totalPrice
      };

    }
    penaltyInfoList = penaltyInfoList.filter((item) => item.policy !== 'forbiddenArea' && item.policy !== 'outOfRange')

    for (let penaltyInfo of penaltyInfoList) {
      let detail = {
        type: 'penalty',
        policy: penaltyInfo.policy,
        price: 0
      }

      switch (penaltyInfo.policy) {
        case "": {
          break;
        }
        //case 추가
      }
      totalPrice += detail.price; //벌금 부과
      discountPenaltyDetails.push(detail);
    }


    const discountInfoList = await this.discountPenaltyInfoRepository.find({
      where: [
        { category: 'area', content: area, type: 'discount' },
        { category: 'kickboard', content: use.useDeerName, type: 'discount' },
        { category: 'user', content: user.id, type: 'discount' },
        { category: 'all', type: 'discount' },
      ]
    });

    for (let discountInfo of discountInfoList) {
      let detail = {
        type: 'discount',
        policy: discountInfo.policy,
        price: 0
      }

      switch (discountInfo.policy) {
        case "parkingZone": {
          if (checkInsideParkingZone) {
            detail.price = (regularRate.basic + regularRate.ratePerMinute) * (discountInfo.price / 100);
          }
          break;
        }
        case "useIn30Minute": {
          if (user.lastUsed) {

            let min = await this.calculateUsedTime(user.lastUsed, use.useStartAt);
            if (min <= 30) {
              detail.price = regularRate.basic;
            }
          }
          break;

          //case 추가
        }
        case "parkingZoneFree": {

          if (checkInsideParkingZone) {
            detail.price = regularRate.basic + regularRate.ratePerMinute;
          }
          break;
        }

      }

      totalPrice -= detail.price; //할인액 차감
      discountPenaltyDetails.push(detail);
    }


    return {
      details: discountPenaltyDetails,
      totalPrice: totalPrice < 0 ? 0 : totalPrice
    };
  }
  // 이용시간 계산 유틸리티 메서드
  calculateUsedTime(startDateTime: Date, endDateTime: Date): number {
    const diff = endDateTime.getTime() - startDateTime.getTime();
    const min = Math.floor(diff / 1000 / 60);
    return min;
  }

}
