import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/addProduct.dto';
import { UpdateCartDto } from './dto/updateCart.dto';
import { RemoveProductDto } from './dto/removeProduct.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  @ApiResponse({
    status: 200,
    description: 'Product added successfully whether incremented or added',
  })
  @ApiResponse({
    status: 403,
    description: 'Product not found or out of stock',
  })
  async addProduct(@Body() addProductDto: AddProductDto) {
    return this.cartService.addProduct(addProductDto);
  }

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'List of products inside the cart',
  })
  async getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }

  @Put('update')
  @ApiResponse({
    status: 200,
    description: 'Product quantity updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Product not found or out of stock',
  })
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @Delete('remove')
  @ApiResponse({
    status: 200,
    description: 'Product removed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Product not found',
  })
  async removeProduct(@Body() removeProductDto: RemoveProductDto) {
    return this.cartService.removeProduct(removeProductDto);
  }
}
