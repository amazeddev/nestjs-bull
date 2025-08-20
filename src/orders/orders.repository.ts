import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MealCategory, OrderStatus } from '../common/types';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderMeal {
  @Prop({ required: true })
  mealId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: MealCategory;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  quantity!: number;
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true })
  status!: OrderStatus;

  @Prop({ required: true })
  meals!: OrderMeal[];

  @Prop({ required: true })
  totalPrice!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

@Injectable()
export class OrdersRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().lean();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).lean();
  }

  async create(order: Order): Promise<Order & { _id: ObjectId }> {
    return this.orderModel.create(order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
  }
}
