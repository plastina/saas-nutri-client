import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Food } from '../../models/food.model';
import { TranslatePipe } from '../../pipes/t.pipe';

@Component({
  selector: 'app-meal-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule, TranslatePipe],
  templateUrl: './meal-management.component.html',
  styleUrls: ['./meal-management.component.scss'],
})
export class MealManagementComponent {
  @Input() selectedMealName = '';
  @Input() foodSearchSuggestions: Food[] = [];
  @Input() selectedFoodAutoComplete: Food | string | null = null;

  @Output() foodSearch = new EventEmitter<string>();
  @Output() foodSelected = new EventEmitter<Food>();
}
