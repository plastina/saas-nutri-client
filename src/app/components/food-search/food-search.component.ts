import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const FOOD_SEARCH_IMPORTS = [
  FormsModule,
  CommonModule,
  InputTextModule,
  ButtonModule
];

@Component({
  selector: 'app-food-search',
  standalone: true,
  imports: [ ...FOOD_SEARCH_IMPORTS ],
  templateUrl: './food-search.component.html',
  styleUrls: ['./food-search.component.scss']
})
export class FoodSearchComponent {
  searchTerm = '';
  @Output() searchTermSubmitted = new EventEmitter<string>();


  onSearch(): void {
    if (!this.searchTerm.trim()) {
      return;
    }
    this.searchTermSubmitted.emit(this.searchTerm);
  }
}