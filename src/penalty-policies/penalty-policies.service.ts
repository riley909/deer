import { Injectable } from '@nestjs/common';
import { BasicRatePolicy } from '../common/basic-rate-policy';
import { RangePenaltyPolicy } from './range-penalty-policy';

@Injectable()
export class PenaltyPoliciesService {

  isSatisfiedPenaltyList(areaId: string): any {

    return {};
  }
}
