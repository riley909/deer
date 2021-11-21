import { Injectable, NotFoundException } from '@nestjs/common';
import { RegularPolicy } from './regular-policy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegularPoliciesService {
  constructor(
    @InjectRepository(RegularPolicy)
    private readonly regularPolicyRepository: Repository<RegularPolicy>,
  ) { }

  async calculateRegularRate(area: string, usedTime: number) {
    const regularPolicy = await this.regularPolicyRepository.findOne(area);
    if (!regularPolicy) {
      throw new NotFoundException(`"${area}" 요금제가 존재하지 않습니다.`);
    }
    //todo 계산된 요금 반환
    return regularPolicy.calculate(usedTime);
  }
}
