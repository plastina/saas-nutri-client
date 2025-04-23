import { Food } from './food.model';

export interface DietItem {
  food: Food;
  displayQuantity: number;
  selectedMeasure: string;
  quantityInGrams: number;
}
