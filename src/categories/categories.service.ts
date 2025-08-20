import { Injectable } from '@nestjs/common';
import { MealCategory } from '../common/types';

@Injectable()
export class CategoriesService {
  async getCategories(): Promise<MealCategory[]> {
    return Object.values(MealCategory);
  }
}
