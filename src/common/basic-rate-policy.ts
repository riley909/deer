import { RatePolicy } from './rate-policy';

export abstract class BasicRatePolicy implements RatePolicy {
  calculateRate(minute: number): number {
    return this.calculate(minute);
  }
  abstract calculate(minute: number): number;
}
