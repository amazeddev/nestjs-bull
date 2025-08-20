import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OrderStatus } from '../common/types';
import { OrderProducerService } from './orders.producer';
import { OrdersService } from './orders.service';

@Processor('orders', { concurrency: 1 })
export class OrderProcessorService extends WorkerHost {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderProducerService: OrderProducerService,
  ) {
    super();
  }

  async process(job: Job) {
    console.log('job', job.name);
    if (job.name === 'in_kitchen') {
      await this.ordersService.updateOrderStatus(
        job.data.orderId,
        OrderStatus.InTheKitchen,
      );
    }
    if (job.name === 'kitchen_done') {
      await this.orderProducerService.orderCooked(job.data.orderId);
    }
    if (job.name === 'in_delivery') {
      await this.ordersService.updateOrderStatus(
        job.data.orderId,
        OrderStatus.InDelivery,
      );
    }
    if (job.name === 'delivery_done') {
      await this.ordersService.updateOrderStatus(
        job.data.orderId,
        OrderStatus.Done,
      );
    }
  }
}
