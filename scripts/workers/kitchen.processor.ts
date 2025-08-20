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
  'kitchen',
  async (job) => {
    if (job.name === 'order_created') {
      console.log('! - kitchen');
      console.log(`order come to kitchen [${job.data.orderId}]`);

      // notify order come to kitchen
      await ordersQueue.add('in_kitchen', { orderId: job.data.orderId });

      // simulate kitchen work
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // notify order is ready
      await ordersQueue.add('kitchen_done', { orderId: job.data.orderId });
      console.log(
        `kitchen job [${job.id}] completed! [order: ${job.data.orderId}]`,
      );
    }
  },
  { connection },
);
