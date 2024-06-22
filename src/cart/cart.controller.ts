import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}
}
