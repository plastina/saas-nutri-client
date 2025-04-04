import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Food } from '../../models/food.model';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

const FOOD_LIST_IMPORTS = [
  CommonModule,
  ButtonModule,
  DividerModule
];

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [ ...FOOD_LIST_IMPORTS ],
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent {
  @Input() foods: Food[] = [];
  @Output() foodSelected = new EventEmitter<Food>();

  addFoodToDiet(food: Food) {
    this.foodSelected.emit(food);
  }
}