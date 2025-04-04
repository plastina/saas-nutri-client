import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meal } from '../../models/meal.model';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

const DIET_BUILDER_IMPORTS = [
  CommonModule,
  FormsModule,
  CardModule,
  InputTextModule,
  InputNumberModule,
  ButtonModule,
  DividerModule,
  TooltipModule 
];

@Component({
  selector: 'app-diet-builder',
  standalone: true,
  imports: [ ...DIET_BUILDER_IMPORTS ],
  templateUrl: './diet-builder.component.html',
  styleUrls: ['./diet-builder.component.scss']
})
export class DietBuilderComponent {
  @Input() meals: Meal[] = [];
  @Output() itemRemoved = new EventEmitter<{ mealIndex: number, itemIndex: number }>();
  @Output() quantityChanged = new EventEmitter<void>();
  @Output() mealNameChanged = new EventEmitter<{ index: number, newName: string }>();
  @Output() mealDeleted = new EventEmitter<number>();

  editingMealIndex: number | null = null;
  editedMealName = '';

  removeFoodFromDiet(mealIndex: number, itemIndex: number): void {
    this.itemRemoved.emit({ mealIndex, itemIndex });
  }

  onQuantityChange(): void {
    this.quantityChanged.emit();
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
    if (confirm(`Tem certeza que deseja excluir a refeição "${this.meals[index].name}" e todos os seus itens?`)) {
      this.mealDeleted.emit(index);
    }
  }
}