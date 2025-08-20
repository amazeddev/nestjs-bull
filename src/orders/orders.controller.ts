import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from './dtos/createOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: CreateOrderResponse,
  })
  @ApiBody({ type: CreateOrderRequest, description: 'Create order request' })
  async createOrder(@Body() order: CreateOrderRequest) {
    return this.ordersService.createOrder(order);
  }

  @Get('/')
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('/:orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }
}
