import { Model, HydratedDocument, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MealCategory } from '../common/types';

export type MealDocument = HydratedDocument<Meal>;

@Schema({ collection: 'meals', timestamps: true })
export class Meal {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: MealCategory;

  @Prop({ required: true })
  price!: number;
}

export const MealSchema = SchemaFactory.createForClass(Meal);

@Injectable()
export class MealsRepository {
  constructor(@InjectModel(Meal.name) private mealModel: Model<Meal>) {}

  async findAll(): Promise<Meal[]> {
    return this.mealModel.find().lean();
  }

  async findByIds(ids: string[]): Promise<Meal[]> {
    return this.mealModel
      .find({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } })
      .lean();
  }
}
