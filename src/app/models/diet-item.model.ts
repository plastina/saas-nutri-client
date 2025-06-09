import { Food } from './food.model';
import { Measure } from './measure.model';

export interface DietItem {
  food: Food;
  displayQuantity: number;
  selectedMeasure: string;
  quantityInGrams: number;
  measures: Measure[];
}
