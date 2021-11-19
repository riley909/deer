import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryColumn()
  id: string;
}
