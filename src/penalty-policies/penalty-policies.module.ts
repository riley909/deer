import { Module } from '@nestjs/common';
import { PenaltyPoliciesService } from './penalty-policies.service';

@Module({
  exports: [PenaltyPoliciesService],
  providers: [PenaltyPoliciesService],
})
export class PenaltyPoliciesModule {}
