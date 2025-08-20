import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../common/types';
import { OrdersRepository, Order } from './orders.repository';
import { OrderProducerService } from './orders.producer';
import { MealsService } from '../meals/meals.service';
import { CreateOrderRequest } from './dtos/createOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly mealsService: MealsService,
    private readonly orderProducerService: OrderProducerService,
  ) {}

  async createOrder(order: CreateOrderRequest): Promise<Order> {
    const mealsData = await this.mealsService.getMealsByIds(
      order.meals.map((meal) => meal.mealId),
    );
    if (!mealsData.length) {
      throw new NotFoundException('Meals not found');
    }

    const meals = mealsData.map((meal) => ({
      mealId: meal._id.toString(),
      name: meal.name,
      category: meal.category,
      price: meal.price,
      quantity:
        order.meals.find((m) => m.mealId === meal._id.toString())?.quantity ??
        0,
    }));

    const totalPrice =
      Math.round(
        meals.reduce((acc, meal) => acc + meal.price * meal.quantity, 0) * 100,
      ) / 100;
    const data = await this.ordersRepository.create({
      status: OrderStatus.New,
      meals,
      totalPrice,
    });
    await this.orderProducerService.orderCreated(data._id.toString());

    return data;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    console.log('updateOrderStatus', orderId, status);
    return this.ordersRepository.updateOrderStatus(orderId, status);
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.ordersRepository.findById(id);
  }
}
