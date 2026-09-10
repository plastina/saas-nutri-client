import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { PatientData } from '../../models/patient-data.model';
import { TranslatePipe } from '../../pipes/t.pipe';

@Component({
  selector: 'app-patient-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    Textarea,
    TranslatePipe,
  ],
  templateUrl: './patient-section.component.html',
  styleUrls: ['./patient-section.component.scss'],
})
export class PatientSectionComponent {
  @Input() patientData!: PatientData;
  /** Initial open state only; the user toggles freely afterwards. */
  @Input() startExpanded = true;
  @Output() patientDataChange = new EventEmitter<PatientData>();

  emitChange() {
    this.patientDataChange.emit(this.patientData);
  }

  get age(): number | null {
    const dob = this.patientData?.dob;
    if (!dob) return null;
    const date = dob instanceof Date ? dob : new Date(dob);
    if (Number.isNaN(date.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
      years--;
    }
    return years >= 0 && years < 150 ? years : null;
  }

  get weight(): number | null {
    return this.patientData?.weight ?? null;
  }

  get height(): number | null {
    return this.patientData?.height ?? null;
  }

  get hasSummaryFacts(): boolean {
    return this.weight !== null || this.height !== null || this.age !== null;
  }
}
