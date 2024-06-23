import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId/orders')
  @ApiResponse({
    status: 200,
    description: 'The orders details that user have done',
  })
  async getUserOrderHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserOrderHistory(userId);
  }
}
