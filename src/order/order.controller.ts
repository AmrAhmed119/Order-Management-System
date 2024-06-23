import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
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
  async getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrder(orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, updateStatusDto.status);
  }

  @Post('apply-coupon')
  async applyCoupon(@Body() couponDto: CouponDto) {
    return this.orderService.applyCoupon(couponDto);
  }
}
