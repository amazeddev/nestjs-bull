import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonConfig } from './config/common.config';
import { RedisConfig } from './config/redis.config';
import { MongoConfig } from './config/mongo.config';
import { OrdersModule } from './orders/orders.module';
import { MealsModule } from './meals/meals.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CommonConfig, RedisConfig, MongoConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigType<typeof MongoConfig>) => ({
        uri: config.uri,
      }),
      inject: [MongoConfig.KEY],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigType<typeof RedisConfig>) => ({
        connection: config,
      }),
      inject: [RedisConfig.KEY],
    }),
    OrdersModule,
    MealsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
