import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DiscountPenaltyInfo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column() // //basic, penalty, discount
  type: string;

  @Column() // area, kickboard, user, all
  category: string;

  @Column() // 지역명, 킥보드id, userId
  content: string;

  @Column() // '무료1', '할인1', '할인2', '벌금1', '벌금2',... 'outOfRange'
  policy: string;

  @Column()
  price: number;
}
