import { DietBuilderComponent } from './diet-builder.component';
import { Meal } from '../../models/meal.model';
import { Food } from '../../models/food.model';
import { ConfirmationService } from 'primeng/api';
import { I18nService } from '../../services/i18n.service';

function makeFood(overrides: Partial<Food> = {}): Food {
  return {
    id: '1',
    name: 'Arroz',
    source: 'TACO',
    energy_kcal: 130,
    protein_g: 2.7,
    carbohydrate_g: 28.2,
    fat_g: 0.3,
    fiber_g: 1.6,
    household_measures: [],
    ...overrides,
  };
}

function makeComponent(): DietBuilderComponent {
  return new DietBuilderComponent(
    {} as ConfirmationService,
    {} as I18nService,
  );
}

describe('DietBuilderComponent', () => {
  describe('getMealMacros', () => {
    it('returns zeros for a meal with no items', () => {
      const component = makeComponent();
      const meal: Meal = { name: 'Café da manhã', items: [] };

      expect(component.getMealMacros(meal)).toEqual({
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      });
    });

    it('sums macros across items, scaled by quantity', () => {
      const component = makeComponent();
      const meal: Meal = {
        name: 'Almoço',
        items: [
          {
            food: makeFood(),
            displayQuantity: 200,
            selectedMeasure: '',
            quantityInGrams: 200,
            measures: [],
          },
          {
            food: makeFood({
              protein_g: 20,
              carbohydrate_g: 0,
              fat_g: 15,
              fiber_g: 0,
            }),
            displayQuantity: 100,
            selectedMeasure: '',
            quantityInGrams: 100,
            measures: [],
          },
        ],
      };

      expect(component.getMealMacros(meal)).toEqual({
        protein: 25.4,
        carbs: 56.4,
        fat: 15.6,
        fiber: 3.2,
      });
    });

    it('ignores items without a resolved food or quantity', () => {
      const component = makeComponent();
      const meal: Meal = {
        name: 'Lanche',
        items: [
          {
            food: makeFood(),
            displayQuantity: 100,
            selectedMeasure: '',
            quantityInGrams: 100,
            measures: [],
          },
          {
            food: null as unknown as Food,
            displayQuantity: 0,
            selectedMeasure: '',
            quantityInGrams: NaN,
            measures: [],
          },
        ],
      };

      expect(component.getMealMacros(meal)).toEqual({
        protein: 2.7,
        carbs: 28.2,
        fat: 0.3,
        fiber: 1.6,
      });
    });
  });
});
