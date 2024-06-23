import { ApiProperty } from '@nestjs/swagger';
import { orderstatus } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Pending|Cancelled|Completed|Refunded',
    required: true,
  })
  status: orderstatus;
}
