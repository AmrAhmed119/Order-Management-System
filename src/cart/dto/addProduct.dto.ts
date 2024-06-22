import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddProductDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  productId: number;
}
