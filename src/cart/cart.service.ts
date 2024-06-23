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
    const cart = await this.prisma.carts.findFirst({ where: { userId } });

    if (!cart) {
      return await this.prisma.carts.create({ data: { userId } });
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
      select: { quantity: true },
    });

    return productQuantity ? productQuantity.quantity : 0;
  }

  /**
   * @param productId
   * @returns product details
   */
  async getProductDetails(productId: number): Promise<Products | null> {
    const product = await this.prisma.products.findUnique({
      where: { productId },
    });

    return product;
  }

  /**
   * @param cartId
   * @param productId
   * @param quantity
   * @description increments the quantity of the product in a given cart
   */
  async changeProductQuantity(
    cartId: number,
    productId: number,
    newQuantity: number,
  ): Promise<void> {
    await this.prisma.carts_Products.update({
      where: {
        Carts_cartId_Products_productId: {
          Carts_cartId: cartId,
          Products_productId: productId,
        },
      },
      data: { quantity: newQuantity },
    });
  }

  /**
   * @param productId
   * @returns void
   * @description decrement the stock of the product by 1
   */
  async changeProductStock(productId: number, newStock: number): Promise<void> {
    await this.prisma.products.update({
      where: { productId },
      data: { stock: newStock },
    });
  }

  /**
   * @param cartId
   * @param productId
   * @returns void
   * @description create a product in the cart
   */
  async createProduct(cartId: number, productId: number): Promise<void> {
    await this.prisma.carts_Products.create({
      data: {
        Carts: {
          connect: {
            cartId,
          },
        },
        Products: {
          connect: {
            productId,
          },
        },
        quantity: 1,
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
    await this.changeProductStock(addProductDto.productId, product.stock - 1);

    if (productQuantity > 0) {
      this.changeProductQuantity(
        userCart.cartId,
        addProductDto.productId,
        productQuantity + 1,
      );
      return `Product quantity updated, new quantity ${productQuantity + 1}`;
    }

    // if product is not in the cart, add it to the cart
    this.createProduct(userCart.cartId, addProductDto.productId);

    return `${product.name} is added to the cart`;
  }

  /**
   * @param cartId
   * @returns list of product details that present in the cart
   */
  async getCartProducts(cartId: number) {
    return await this.prisma.carts_Products.findMany({
      where: { Carts_cartId: cartId },
      select: {
        quantity: true,
        Products: {
          select: {
            name: true,
            price: true,
          },
        },
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
  async updateCart(updateCartDto: UpdateCartDto): Promise<string> {
    const userCart = await this.getUserCart(updateCartDto.userId);
    const productQuantity = await this.getProductQuantity(
      userCart.cartId,
      updateCartDto.productId,
    );

    const product: Products = await this.getProductDetails(
      updateCartDto.productId,
    );

    if (productQuantity === 0) {
      throw new ForbiddenException('Product not found in the cart!');
    }

    if (updateCartDto.quantity > product.stock) {
      throw new ForbiddenException('Product out of stock!');
    }

    await this.changeProductQuantity(
      userCart.cartId,
      updateCartDto.productId,
      updateCartDto.quantity,
    );

    await this.changeProductStock(
      product.productId,
      product.stock + productQuantity - updateCartDto.quantity,
    );

    return `Product quantity updated to ${updateCartDto.quantity}`;
  }

  /**
   * @param removeProductDto
   * @returns string
   * @description remove a product from the cart
   */
  async removeProduct(removeProductDto: RemoveProductDto): Promise<string> {
    const userCart = await this.getUserCart(removeProductDto.userId);
    const productQuantity = await this.getProductQuantity(
      userCart.cartId,
      removeProductDto.productId,
    );

    if (productQuantity === 0) {
      throw new ForbiddenException('Product not found in the cart!');
    }

    // remove product from cart
    await this.prisma.carts_Products.delete({
      where: {
        Carts_cartId_Products_productId: {
          Carts_cartId: userCart.cartId,
          Products_productId: removeProductDto.productId,
        },
      },
    });

    // increase the quantity of the product in the stock
    const product = await this.getProductDetails(removeProductDto.productId);
    await this.changeProductStock(
      product.productId,
      product.stock + productQuantity,
    );

    return 'Product removed from the cart and stock quantity updated!';
  }
}
