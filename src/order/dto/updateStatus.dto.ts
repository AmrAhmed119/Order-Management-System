import { orderstatus } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  status: orderstatus;
}
