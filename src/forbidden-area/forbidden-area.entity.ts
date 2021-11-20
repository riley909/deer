import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Area } from '../area/area.entity';

@Entity()
export class ForbiddenArea {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'polygon' })
  forbiddenAreaBoundary: number;

  @Column({ type: 'linestring' })
  forbiddenAreaCoords: number;

  @ManyToOne(() => Area)
  area: Area;
}
