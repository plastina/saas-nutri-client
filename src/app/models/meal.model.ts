import { DietItem } from './diet-item.model';

export interface Meal {
  name: string;
  items: DietItem[];
}