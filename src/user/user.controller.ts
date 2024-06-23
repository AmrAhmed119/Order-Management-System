import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId/orders')
  async getUserOrderHistory(@Param('userId') userId: number) {
    return this.userService.getUserOrderHistory(Number(userId));
  }
}
