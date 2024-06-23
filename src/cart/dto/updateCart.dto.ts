import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 123,
    required: true,
  })
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 56,
    required: true,
  })
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 100,
    required: true,
  })
  quantity: number;
}
