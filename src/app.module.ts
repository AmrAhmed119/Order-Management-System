import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CartModule, OrderModule, PrismaModule],
})
export class AppModule {}
