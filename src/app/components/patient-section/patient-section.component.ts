import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { PatientData } from '../../models/patient-data.model';

@Component({
  selector: 'app-patient-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    Textarea,
  ],
  templateUrl: './patient-section.component.html',
  styleUrls: ['./patient-section.component.scss'],
})
export class PatientSectionComponent {
  @Input() patientData!: PatientData;
  @Output() patientDataChange = new EventEmitter<PatientData>();

  emitChange() {
    this.patientDataChange.emit(this.patientData);
  }
}
