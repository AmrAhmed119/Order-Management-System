import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId
   * @returns the order history of the user
   */
  async getUserOrderHistory(userId: number) {
    try {
      // Get all orders of the user
      const orders = await this.prisma.orders.findMany({
        where: { userId },
        select: {
          orderId: true,
          orderDate: true,
          status: true,
          Orders_Products: {
            select: {
              quantity: true,
              Products_productId: true,
            },
          },
        },
      });

      return orders;
    } catch (error) {
      throw new Error('Error while fetching user order history');
    }
  }
}
