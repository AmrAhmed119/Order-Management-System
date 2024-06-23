import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  userId: number;
}
