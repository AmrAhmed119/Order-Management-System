import { IsNotEmpty, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class RemoveProductDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  productId: number;
}
