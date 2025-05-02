import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Food } from '../../models/food.model';
import { Meal } from '../../models/meal.model';

@Component({
  selector: 'app-meal-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './meal-management.component.html',
  styleUrls: ['./meal-management.component.scss'],
})
export class MealManagementComponent {
  @Input() meals: Meal[] = [];
  @Input() selectedMealName: string = '';
  @Input() foodSearchSuggestions: Food[] = [];
  @Input() selectedFoodsForAdding: Food[] = [];
  @Input() selectedFoodAutoComplete: Food | string | null = null;

  @Output() mealAdded = new EventEmitter<string>();
  @Output() foodSearch = new EventEmitter<string>();
  @Output() foodSelected = new EventEmitter<Food>();
  @Output() foodRemoved = new EventEmitter<number>();
  @Output() addFoodsToMeal = new EventEmitter<void>();
  @Output() selectedMealNameChange = new EventEmitter<string>();

  onAddMeal(input: HTMLInputElement) {
    const name = input.value.trim();
    if (name) {
      this.mealAdded.emit(name);
      input.value = '';
    }
  }
}
