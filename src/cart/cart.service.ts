import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductDto } from './dto/addProduct.dto';
import { UpdateCartDto } from './dto/updateCart.dto';
import { RemoveProductDto } from './dto/removeProduct.dto';
import { Carts, Products } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId
   * @returns User cart
   * @description Get user cart by userId and if not found create one
   */
  async getUserCart(userId: number): Promise<Carts> {
    const cart = await this.prisma.carts.findFirst({
      where: {
        userId,
      },
    });

    if (!cart) {
      return await this.prisma.carts.create({
        data: {
          userId,
        },
      });
    }

    return cart;
  }

  /**
   * @param cartId
   * @param productId
   * @returns Product quantity in the cart
   */
  async getProductQuantity(cartId: number, productId: number): Promise<number> {
    const productQuantity = await this.prisma.carts_Products.findFirst({
      where: {
        Carts_cartId: cartId,
        Products_productId: productId,
      },
      select: {
        quantity: true,
      },
    });

    if (!productQuantity) {
      return 0;
    }

    return productQuantity.quantity;
  }

  /**
   * @param productId
   * @returns product details
   */
  async getProductDetails(productId: number): Promise<Products> {
    const product = await this.prisma.products.findUnique({
      where: {
        productId,
      },
    });

    return product;
  }

  /**
   * @param cardId
   * @param productId
   * @param quantity
   * @description increments the quantity of the product in a given cart
   */
  async incrementProductQuantity(
    cardId: number,
    productId: number,
    quantity: number,
  ) {
    await this.prisma.carts_Products.update({
      where: {
        Carts_cartId_Products_productId: {
          Carts_cartId: cardId,
          Products_productId: productId,
        },
      },
      data: {
        quantity: quantity + 1,
      },
    });
  }

  /**
   * @param addProductDto
   * @returns string
   * @description add a product to the cart if not exist or increment it if exist
   */
  async addProduct(addProductDto: AddProductDto): Promise<string> {
    // get user cart and if not found create one
    const userCart: Carts = await this.getUserCart(addProductDto.userId);

    // if product is in the cart, increment the quantity
    const productQuantity: number = await this.getProductQuantity(
      userCart.cartId,
      addProductDto.productId,
    );

    const product: Products = await this.getProductDetails(
      addProductDto.productId,
    );

    if (!product) {
      throw new ForbiddenException('Product not found!');
    }

    if (product.stock <= 0) {
      throw new ForbiddenException('Product out of stock!');
    }

    // decrement product stock
    await this.prisma.products.update({
      where: {
        productId: addProductDto.productId,
      },
      data: {
        stock: product.stock - 1,
      },
    });

    if (productQuantity > 0) {
      this.incrementProductQuantity(
        userCart.cartId,
        addProductDto.productId,
        productQuantity,
      );
      return `Product quantity updated, new quantity ${productQuantity + 1}`;
    }

    // if product is not in the cart, add it to the cart
    await this.prisma.carts_Products.create({
      data: {
        Carts: {
          connect: {
            cartId: userCart.cartId,
          },
        },
        Products: {
          connect: {
            productId: addProductDto.productId,
          },
        },
        quantity: 1,
      },
    });

    return `${product.name} is added to the cart`;
  }

  /**
   * @param cartId
   * @returns list of product details that present in the cart
   */
  async getCartProducts(cartId: number) {
    // get cart products and join with table products to get product details
    return await this.prisma.carts_Products.findMany({
      where: {
        Carts_cartId: cartId,
      },
      include: {
        Products: true,
      },
    });
  }

  /**
   * @param userId
   * @returns All product details in the cart of given user
   */
  async getCart(userId: number) {
    const cart = this.getUserCart(userId);
    return this.getCartProducts((await cart).cartId);
  }

  /**
   * @param updateCartDto
   * @returns string
   * @description update the quantity of the product in the cart
   */
  async updateCart(updateCartDto: UpdateCartDto) {
    const userCart = await this.getUserCart(updateCartDto.userId);
    const productQuantity = await this.getProductQuantity(
      userCart.cartId,
      updateCartDto.productId,
    );

    if (productQuantity === 0) {
      throw new ForbiddenException('Product not found in the cart!');
    }

    await this.prisma.carts_Products.update({
      where: {
        Carts_cartId_Products_productId: {
          Carts_cartId: userCart.cartId,
          Products_productId: updateCartDto.productId,
        },
      },
      data: {
        quantity: updateCartDto.quantity,
      },
    });

    return `Product quantity updated to ${updateCartDto.quantity}`;
  }

  /**
   * @param removeProductDto
   * @returns string
   * @description remove a product from the cart
   */
  async removeProduct(removeProductDto: RemoveProductDto) {
    const userCart = await this.getUserCart(removeProductDto.userId);
    const productQuantity = await this.getProductQuantity(
      userCart.cartId,
      removeProductDto.productId,
    );

    if (productQuantity === 0) {
      throw new ForbiddenException('Product not found in the cart!');
    }

    await this.prisma.carts_Products.delete({
      where: {
        Carts_cartId_Products_productId: {
          Carts_cartId: userCart.cartId,
          Products_productId: removeProductDto.productId,
        },
      },
    });

    return 'Product removed from the cart';
  }
}
