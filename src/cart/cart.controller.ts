import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/addProduct.dto';
import { UpdateCartDto } from './dto/updateCart.dto';
import { RemoveProductDto } from './dto/removeProduct.dto';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addProduct(@Body() addProductDto: AddProductDto) {
    return this.cartService.addProduct(addProductDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: number) {
    return this.cartService.getCart(Number(userId));
  }

  @Put('update')
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @Delete('remove')
  async removeProduct(@Body() removeProductDto: RemoveProductDto) {
    return this.cartService.removeProduct(removeProductDto);
  }
}
