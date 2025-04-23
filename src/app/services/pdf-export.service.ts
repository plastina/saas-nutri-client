import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Meal } from '../models/meal.model';
import { PatientData } from '../models/patient-data.model';
import { PlanTotals } from '../models/plan-totals.model';

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  constructor() {}

  generateDietPlanPdf(
    meals: Meal[],
    totals: PlanTotals,
    patientData?: PatientData
  ) {
    const doc = new jsPDF();
    let yPos = 15;

    doc.setFontSize(18);
    doc.text('Plano Alimentar', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    if (patientData?.name) {
      doc.setFont('helvetica', 'bold');
      doc.text('Paciente:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(patientData.name!, 38, yPos);
      yPos += 6;
    }

    if (patientData?.dob) {
      const formattedDob = patientData.dob.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      doc.setFont('helvetica', 'bold');
      doc.text('Data Nasc.:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(formattedDob, 38, yPos);
      yPos += 6;
    }

    let weightHeightLine = '';
    if (patientData?.weight) {
      weightHeightLine += `Peso: ${patientData.weight.toFixed(1)} kg`;
    }
    if (patientData?.height) {
      if (weightHeightLine) weightHeightLine += '    ';
      weightHeightLine += `Altura: ${patientData.height.toFixed(0)} cm`;
    }
    if (weightHeightLine) {
      doc.setFont('helvetica', 'normal');
      doc.text(weightHeightLine, 14, yPos);
      yPos += 6;
    }

    if (patientData?.goals) {
      doc.setFont('helvetica', 'bold');
      doc.text('Objetivos:', 14, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const goalsLines = doc.splitTextToSize(patientData.goals, 180);
      doc.text(goalsLines, 14, yPos);
      yPos += goalsLines.length * 4 + 2;
    }

    if (patientData?.observations) {
      doc.setFont('helvetica', 'bold');
      doc.text('Observações:', 14, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const obsLines = doc.splitTextToSize(patientData.observations, 180);
      doc.text(obsLines, 14, yPos);
      yPos += obsLines.length * 4 + 2;
    }

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    meals.forEach((meal) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 15;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(meal.name, 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;

      const head = [['Alimento', 'Qtd (g)', 'Kcal', 'P (g)', 'C (g)', 'F (g)']];
      const body = meal.items.map((item) => {
        const food = item.food || {};
        const qty =
          typeof item.displayQuantity === 'number' ? item.displayQuantity : 0;
        const factor = qty / 100;
        return [
          food.name || 'N/A',
          qty.toFixed(0),
          ((food.energy_kcal || 0) * factor).toFixed(0),
          ((food.protein_g || 0) * factor).toFixed(1),
          ((food.carbohydrate_g || 0) * factor).toFixed(1),
          ((food.fat_g || 0) * factor).toFixed(1),
        ];
      });

      if (body.length > 0) {
        autoTable(doc, {
          head: head,
          body: body,
          startY: yPos,
          theme: 'grid',
          headStyles: { fillColor: [63, 195, 133], textColor: [255, 255, 255] },
          styles: { fontSize: 9, cellPadding: 1.5 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 18, halign: 'right' },
            2: { cellWidth: 18, halign: 'right' },
            3: { cellWidth: 18, halign: 'right' },
            4: { cellWidth: 18, halign: 'right' },
            5: { cellWidth: 18, halign: 'right' },
          },
          margin: { left: 14, right: 14 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Refeição vazia.', 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        yPos += 10;
      }
    });

    if (yPos > 250) {
      doc.addPage();
      yPos = 15;
    }
    doc.setFontSize(14);
    doc.text('Totais do Plano', 14, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`Calorias: ${totals.totalKcal.toFixed(0)} kcal`, 16, yPos);
    yPos += 5;
    doc.text(`Proteínas: ${totals.totalProtein.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Carboidratos: ${totals.totalCarbs.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Gorduras: ${totals.totalFat.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Fibras: ${totals.totalFiber.toFixed(1)} g`, 16, yPos);

    doc.save('plano-alimentar.pdf');
  }
}
