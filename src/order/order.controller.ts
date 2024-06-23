import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { CouponDto } from './dto/coupon.dto';

@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async addProduct(@Body() createOderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOderDto);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number) {
    return this.orderService.getOrder(Number(orderId));
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.orderService.updateOrderStatus(
      Number(orderId),
      updateStatusDto.status,
    );
  }

  @Post('apply-coupon')
  async applyCoupon(@Body() couponDto: CouponDto) {
    return this.orderService.applyCoupon(couponDto);
  }
}
