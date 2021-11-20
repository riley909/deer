import { PenaltyPolicy } from '../common/penalty-policy';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Area } from '../area/area.entity';

@Entity()
export class RangePenaltyPolicy implements PenaltyPolicy {

  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Area)
  area: Area;

  calculatePenalty(): number {
    return 0;
  }
}