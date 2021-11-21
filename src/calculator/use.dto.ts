import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class UseDto {
  @IsNotEmpty()
  useUserId: number;
  @IsNotEmpty()
  useDeerName: string;
  @IsNotEmpty()
  useEndLat: number;
  @IsNotEmpty()
  useEndLng: number;
  @IsNotEmpty()
  @Type(() => Date)
  useStartAt: Date;
  @IsNotEmpty()
  @Type(() => Date)
  useEndAt: Date;
}
