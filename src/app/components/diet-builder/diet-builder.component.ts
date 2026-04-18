import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DietItem } from '../../models/diet-item.model';
import { Meal } from '../../models/meal.model';
import { Measure } from '../../models/measure.model';
import { TranslatePipe } from '../../pipes/t.pipe';
import { I18nService } from '../../services/i18n.service';

const DIET_BUILDER_IMPORTS = [
  CommonModule,
  FormsModule,
  CardModule,
  InputTextModule,
  InputNumberModule,
  ButtonModule,
  DividerModule,
  TooltipModule,
  SelectModule,
  TranslatePipe,
];

@Component({
  selector: 'app-diet-builder',
  standalone: true,
  imports: [...DIET_BUILDER_IMPORTS],
  templateUrl: './diet-builder.component.html',
  styleUrls: ['./diet-builder.component.scss'],
})
export class DietBuilderComponent {
  @Input() meals: Meal[] = [];
  @Input() availableMeasures: Measure[] = [];
  @Input() selectedMealIndex: number | null = null;
  @Input() selectedItemIndex: number | null = null;

  @Output() itemRemoved = new EventEmitter<{
    mealIndex: number;
    itemIndex: number;
  }>();
  @Output() itemChanged = new EventEmitter<{
    mealIndex: number;
    itemIndex: number;
  }>();
  @Output() itemSelectedForEdit = new EventEmitter<{
    mealIndex: number;
    itemIndex: number;
  }>();
  @Output() mealNameChanged = new EventEmitter<{
    index: number;
    newName: string;
  }>();
  @Output() mealDeleted = new EventEmitter<number>();

  editingMealIndex: number | null = null;
  editedMealName = '';

  constructor(
    private confirmationService: ConfirmationService,
    private i18nService: I18nService,
  ) {}

  onItemInputChange(mealIndex: number, itemIndex: number): void {
    this.itemChanged.emit({ mealIndex, itemIndex });
  }

  selectItem(mealIndex: number, itemIndex: number): void {
    this.itemSelectedForEdit.emit({ mealIndex, itemIndex });
  }

  removeFoodFromDiet(mealIndex: number, itemIndex: number): void {
    this.itemRemoved.emit({ mealIndex, itemIndex });
  }

  startEditMeal(index: number, currentName: string): void {
    this.editingMealIndex = index;
    this.editedMealName = currentName;
  }

  cancelEditMeal(): void {
    this.editingMealIndex = null;
    this.editedMealName = '';
  }

  saveEditMeal(index: number): void {
    const newName = this.editedMealName.trim();
    if (newName && this.editingMealIndex === index) {
      this.mealNameChanged.emit({ index, newName });
      this.cancelEditMeal();
    } else {
      this.cancelEditMeal();
    }
  }

  deleteMeal(index: number): void {
    this.confirmationService.confirm({
      message: this.i18nService.t('confirm.deleteMeal.message', {
        mealName: this.meals[index]?.name || '',
      }),
      header: this.i18nService.t('confirm.deleteMeal.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.i18nService.t('confirm.yes'),
      rejectLabel: this.i18nService.t('confirm.no'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.mealDeleted.emit(index);
      },
      reject: () => {},
    });
  }

  getItemKcal(item: DietItem): number {
    if (typeof item?.kcal === 'number') return item.kcal;
    if (!item?.food || typeof item.quantityInGrams !== 'number') return 0;
    const quantityFactor = item.quantityInGrams / 100;
    return (item.food.energy_kcal || 0) * quantityFactor;
  }

  getMealKcal(meal: Meal): number {
    const hasApiItems =
      Array.isArray(meal?.items) &&
      meal.items.some((item) => typeof item?.kcal === 'number');
    if (typeof meal?.totalKcal === 'number' && (hasApiItems || !meal?.items)) {
      return meal.totalKcal;
    }
    if (!meal?.items?.length) return 0;
    return meal.items.reduce(
      (total, item) => total + this.getItemKcal(item),
      0,
    );
  }
}
