import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Meal } from '../../models/meal.model';
import { Measure } from '../../models/measure.model';
import { DietBuilderComponent } from '../diet-builder/diet-builder.component';

@Component({
  selector: 'app-plan-summary',
  standalone: true,
  imports: [CommonModule, ButtonModule, DietBuilderComponent],
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss'],
})
export class PlanSummaryComponent {
  @Input() meals: Meal[] = [];
  @Input() availableMeasures: Measure[] = [];
  @Input() selectedMealIndex: number | null = null;
  @Input() selectedItemIndex: number | null = null;

  @Input() hasItemsInAnyMeal = false;
  @Input() totalKcal = 0;
  @Input() totalProtein = 0;
  @Input() totalCarbs = 0;
  @Input() totalFat = 0;
  @Input() totalFiber = 0;

  @Output() exportToJson = new EventEmitter<void>();
  @Output() exportToPdf = new EventEmitter<void>();
  @Output() importFromFile = new EventEmitter<Event>();

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

  onFileInput(event: Event): void {
    this.importFromFile.emit(event);
  }
}
