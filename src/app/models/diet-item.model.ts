import { Food } from './food.model';

export interface DietItem {
  food: Food;
  quantity: number;
  measureDescription?: string;
}
