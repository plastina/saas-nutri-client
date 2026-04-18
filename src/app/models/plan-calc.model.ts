export interface MealItemCalcRequest {
  food_id: string;
  quantity_in_grams: number;
}

export interface MealCalcRequest {
  name: string;
  items: MealItemCalcRequest[];
}

export interface PlanCalculateRequest {
  meals: MealCalcRequest[];
}

export interface MealItemCalcResponse {
  food_id: string;
  name: string;
  quantity_in_grams: number;
  kcal: number;
}

export interface MealCalcResponse {
  name: string;
  items: MealItemCalcResponse[];
  total_kcal: number;
}

export interface PlanCalculateResponse {
  meals: MealCalcResponse[];
  total_kcal: number;
}
