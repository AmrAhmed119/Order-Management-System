import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {
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
}
