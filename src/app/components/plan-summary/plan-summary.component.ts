import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { TranslatePipe } from '../../pipes/t.pipe';

@Component({
  selector: 'app-plan-summary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss'],
})
export class PlanSummaryComponent {
  @Input() meals: Meal[] = [];
  @Input() hasItemsInAnyMeal = false;
  @Input() totalKcal = 0;
  @Input() totalProtein = 0;
  @Input() totalCarbs = 0;
  @Input() totalFat = 0;
  @Input() totalFiber = 0;

  @Output() exportToJson = new EventEmitter<void>();
  @Output() exportToPdf = new EventEmitter<void>();
  @Output() importFromFile = new EventEmitter<Event>();

  onFileInput(event: Event): void {
    this.importFromFile.emit(event);
  }
}
