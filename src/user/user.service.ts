import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prism: PrismaService) {}

  /**
   * @param userId
   * @returns the order history of the user
   */
  async getUserOrderHistory(userId: number) {
    // get all orders of the user
    const orders = this.prism.orders.findMany({
      where: { userId },
      select: {
        orderId: true,
        orderDate: true,
        status: true,
      },
    });

    // get all products of the order
    for (const order of await orders) {
      const products = this.prism.orders_Products.findMany({
        where: { Orders_orderId: order.orderId },
        select: {
          quantity: true,
          Products_productId: true,
        },
      });
      order['products'] = await products;
    }

    return orders;
  }
}
