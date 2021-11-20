export interface RangePenaltyCondition {
  isSatisfied(useEndLat: number, useEndLng: number): boolean;
}