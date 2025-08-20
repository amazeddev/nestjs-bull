import { Injectable } from '@nestjs/common';
import { Meal, MealsRepository } from './meals.repository';

@Injectable()
export class MealsService {
  constructor(private readonly mealsRepository: MealsRepository) {}

  async getMeals(): Promise<Meal[]> {
    return this.mealsRepository.findAll();
  }

  async getMealsByIds(ids: string[]): Promise<Meal[]> {
    console.log('getMealsByIds', ids);
    return this.mealsRepository.findByIds(ids);
  }
}
