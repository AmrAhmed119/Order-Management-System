import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CouponDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  orderId: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value))
  couponCode: string;
}
