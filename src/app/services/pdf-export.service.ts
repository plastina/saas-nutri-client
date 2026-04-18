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
    patientData?: PatientData,
  ) {
    const doc = new jsPDF();
    let yPos = 20;

    // Title with custom styling
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34); // Forest green
    doc.text('Plano Alimentar Personalizado', 105, yPos, { align: 'center' });
    yPos += 15;

    // Subtitle
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Nutrição Saudável e Equilibrada', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    // Patient info section with background
    if (
      patientData?.name ||
      patientData?.dob ||
      patientData?.weight ||
      patientData?.height
    ) {
      doc.setFillColor(240, 248, 255); // Light blue background
      doc.rect(14, yPos - 5, 180, 25, 'F');
      doc.setFont('times', 'bold');
      doc.setTextColor(25, 25, 112); // Midnight blue
      doc.text('Informações do Paciente', 14, yPos);
      yPos += 6;
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 0);

      if (patientData?.name) {
        doc.setFont('times', 'bold');
        doc.text('Nome:', 16, yPos);
        doc.setFont('times', 'normal');
        doc.text(patientData.name!, 35, yPos);
        yPos += 5;
      }

      if (patientData?.dob) {
        const formattedDob = patientData.dob.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        doc.setFont('times', 'bold');
        doc.text('Data de Nascimento:', 16, yPos);
        doc.setFont('times', 'normal');
        doc.text(formattedDob, 55, yPos);
        yPos += 5;
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
        doc.setFont('times', 'normal');
        doc.text(weightHeightLine, 16, yPos);
        yPos += 5;
      }
      yPos += 5;
    }

    if (patientData?.goals) {
      doc.setFont('times', 'bold');
      doc.setTextColor(25, 25, 112);
      doc.text('Objetivos:', 14, yPos);
      yPos += 5;
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 0);
      const goalsLines = doc.splitTextToSize(patientData.goals, 175);
      doc.text(goalsLines, 14, yPos);
      yPos += goalsLines.length * 4 + 2;
    }

    if (patientData?.observations) {
      doc.setFont('times', 'bold');
      doc.setTextColor(25, 25, 112);
      doc.text('Observações:', 14, yPos);
      yPos += 5;
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 0);
      const obsLines = doc.splitTextToSize(patientData.observations, 175);
      doc.text(obsLines, 14, yPos);
      yPos += obsLines.length * 4 + 2;
    }

    yPos += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    meals.forEach((meal) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34);
      doc.text(meal.name, 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 8;

      const head = [
        ['Alimento', 'Qtd (g)', 'Kcal', 'Prot (g)', 'Carb (g)', 'Fat (g)'],
      ];
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
          headStyles: {
            fillColor: [34, 139, 34],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
          },
          styles: {
            font: 'times',
            fontSize: 9,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: 55, halign: 'left' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 20, halign: 'center' },
          },
          margin: { left: 14, right: 14 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(9);
        doc.setFont('times', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text('Refeição vazia.', 14, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        yPos += 10;
      }
    });

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    // Totals section with background
    doc.setFillColor(240, 248, 255);
    doc.rect(14, yPos - 5, 180, 30, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(25, 25, 112);
    doc.text('Totais do Plano Alimentar', 14, yPos);
    yPos += 8;
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Calorias: ${totals.totalKcal.toFixed(0)} kcal`, 16, yPos);
    yPos += 5;
    doc.text(`Proteínas: ${totals.totalProtein.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Carboidratos: ${totals.totalCarbs.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Gorduras: ${totals.totalFat.toFixed(1)} g`, 16, yPos);
    yPos += 5;
    doc.text(`Fibras: ${totals.totalFiber.toFixed(1)} g`, 16, yPos);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} - SaaS Nutri`,
      105,
      pageHeight - 10,
      { align: 'center' },
    );

    doc.save('plano-alimentar-personalizado.pdf');
  }
}
