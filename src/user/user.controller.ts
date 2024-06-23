import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId/orders')
  async getUserOrderHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserOrderHistory(userId);
  }
}
