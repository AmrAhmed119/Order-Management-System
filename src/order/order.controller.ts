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
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Cart specified not found',
  })
  async createOrder(@Body() createOderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOderDto);
  }

  @Get(':orderId')
  @ApiResponse({
    status: 200,
    description: 'list of product details in order',
  })
  @ApiResponse({
    status: 403,
    description: 'Order not found',
  })
  async getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrder(orderId);
  }

  @Put(':orderId/status')
  @ApiResponse({
    status: 200,
    description: 'status of order updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'status specified not found',
  })
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, updateStatusDto.status);
  }

  @Post('apply-coupon')
  @ApiResponse({
    status: 200,
    description: 'coupon is applied to the order',
  })
  @ApiResponse({
    status: 403,
    description: 'Coupon not found or coupon expired',
  })
  async applyCoupon(@Body() couponDto: CouponDto) {
    return this.orderService.applyCoupon(couponDto);
  }
}
