import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { OrdersRepository, Order, OrderSchema } from './orders.repository';
import { OrderProcessorService } from './orders.processor';
import { OrderProducerService } from './orders.producer';
import { MealsModule } from '../meals/meals.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BullModule.registerQueue(
      {
        name: 'order',
      },
      { name: 'kitchen' },
      { name: 'delivery' },
    ),
    MealsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrderProcessorService,
    OrderProducerService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
