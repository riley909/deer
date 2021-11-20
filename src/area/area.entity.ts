import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'polygon' })
  area_boundary: number;

  @Column({ type: 'point' })
  area_center: number;

  @Column({ type: 'linestring' })
  area_coords: number;
}
