import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 123,
    required: true,
  })
  userId: number;
}
