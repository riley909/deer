import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Area } from '../area/area.entity';
import { RangePenaltyCondition } from '../penalty-policies/range-penalty-condition';

@Entity()
export class ForbiddenArea implements RangePenaltyCondition {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'polygon' })
  forbiddenAreaBoundary: number;

  @Column({ type: 'linestring' })
  forbiddenAreaCoords: number;

  @ManyToOne(() => Area)
  area: Area;

  isSatisfied(useEndLat: number, useEndLng: number): boolean {
    //todo 포비든 에어리어라면 true 아니라면 false
    return false;
  }
}
