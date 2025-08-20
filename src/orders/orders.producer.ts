import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrderProducerService {
  constructor(
    @InjectQueue('kitchen') private kitchenQueue: Queue,
    @InjectQueue('delivery') private deliveryQueue: Queue,
  ) {}

  async orderCreated(orderId: string) {
    await this.kitchenQueue.add('order_created', {
      orderId,
    });
  }

  async orderCooked(orderId: string) {
    console.log('orderCooked', orderId);

    await this.deliveryQueue.add('order_cooked', {
      orderId,
    });
  }
}
