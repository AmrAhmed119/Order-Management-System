import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CouponDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 123,
    required: true,
  })
  orderId: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value))
  @ApiProperty({
    example: 'A34GASD1',
    required: true,
  })
  couponCode: string;
}
