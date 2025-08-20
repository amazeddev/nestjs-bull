import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  port: 6379,
  host: 'localhost',
  password: process.env.REDIS_PASSWORD,
  db: 11,
  maxRetriesPerRequest: null,
});

const ordersQueue = new Queue('orders', { connection });

new Worker(
  'delivery',
  async (job) => {
    if (job.name === 'order_cooked') {
      console.log('! - delivery');
      console.log(`order come to delivery [${job.data.orderId}]`);

      // notify order come to delivery
      await ordersQueue.add('in_delivery', { orderId: job.data.orderId });

      // simulate delivery work
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // notify order is delivered
      await ordersQueue.add('delivery_done', { orderId: job.data.orderId });

      console.log(
        `delivery job [${job.id}] completed! [order: ${job.data.orderId}]`,
      );
    }
  },
  { connection },
);
