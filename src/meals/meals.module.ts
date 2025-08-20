import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealsRepository, Meal, MealSchema } from './meals.repository';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [MealsController],
  providers: [MealsService, MealsRepository],
  exports: [MealsService],
})
export class MealsModule {}
