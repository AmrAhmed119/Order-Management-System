import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { orderstatus } from '@prisma/client';
import { CouponDto } from './dto/coupon.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId
   * @param orderId
   * @description Add products to the order
   */
  async addproducts(userId: number, orderId: number) {
    // get the cart of the user
    const cart = await this.prisma.carts.findFirst({ where: { userId } });

    // get all products in the cart
    const products = this.prisma.carts_Products.findMany({
      where: { Carts_cartId: cart.cartId },
      select: {
        quantity: true,
        Products_productId: true,
      },
    });

    // add all products to the order
    for (const product of await products) {
      await this.prisma.orders_Products.create({
        data: {
          Orders_orderId: orderId,
          Products_productId: product.Products_productId,
          quantity: product.quantity,
        },
      });
    }

    // clear user cart
    await this.prisma.carts_Products.deleteMany({
      where: { Carts_cartId: cart.cartId },
    });
  }

  /**
   * @param createOderDto
   * @returns string
   * @description Create order and add products to the order
   */
  async createOrder(createOderDto: CreateOrderDto) {
    // create order and retrieve orderid
    const order = await this.prisma.orders.create({
      data: {
        orderDate: new Date(),
        status: 'Pending',
        userId: createOderDto.userId,
      },
    });
    this.addproducts(createOderDto.userId, order.orderId);
    return 'Products added to order successfully';
  }

  /**
   * @param orderId
   * @returns All products that are in a given order
   */
  async getOrderProducts(orderId: number) {
    return await this.prisma.orders_Products.findMany({
      where: { Orders_orderId: orderId },
      select: {
        Products_productId: true,
        quantity: true,
      },
    });
  }

  /**
   * @param orderId
   * @returns All order details
   */
  async getOrder(orderId: number) {
    const order = await this.prisma.orders.findUnique({ where: { orderId } });

    if (!order) {
      throw new ForbiddenException('Oder not found!');
    }

    const products = await this.getOrderProducts(orderId);
    console.log(products);
    return {
      orderDate: order.orderDate,
      status: order.status,
      counponUsed: order.couponCode ? true : false,
      products: products,
    };
  }

  /**
   * @param orderId
   * @param status
   * @returns string
   * @description updates the status of an order
   */
  async updateOrderStatus(orderId: number, status: orderstatus) {
    await this.prisma.orders.update({
      where: { orderId: orderId },
      data: { status: status },
    });

    return 'Order status updated!';
  }

  /**
   * @param couponDto
   * @returns string
   * @description Apply coupon to an order
   */
  async applyCoupon(couponDto: CouponDto) {
    // get coupon discount amount
    const coupon = await this.prisma.coupons.findFirst({
      where: { code: couponDto.couponCode },
    });

    if (!coupon) {
      throw new ForbiddenException('Coupon not found!');
    }

    // check if date now between coupon start and end date
    const curDate = new Date();
    if (curDate < coupon.validFrom || curDate > coupon.validTo) {
      throw new ForbiddenException('Coupon expired!');
    }

    await this.prisma.orders.update({
      where: { orderId: couponDto.orderId },
      data: { couponCode: couponDto.couponCode },
    });

    return `Coupon applied successfully! Discount: ${coupon.discountAmount}%`;
  }
}
