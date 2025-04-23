import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DietBuilderComponent } from './components/diet-builder/diet-builder.component';
import { FoodListComponent } from './components/food-list/food-list.component';
import { FoodSearchComponent } from './components/food-search/food-search.component';
import { DietItem } from './models/diet-item.model';
import { Food } from './models/food.model';
import { Meal } from './models/meal.model';
import { Measure } from './models/measure.model';
import { PatientData } from './models/patient-data.model';
import { PlanTotals } from './models/plan-totals.model';
import { FoodApiService } from './services/food-api.service';
import { PdfExportService } from './services/pdf-export.service';

const IMPORTS = [
  FormsModule,
  CommonModule,
  FoodSearchComponent,
  FoodListComponent,
  DietBuilderComponent,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  DividerModule,
  ToolbarModule,
  ToastModule,
  ProgressSpinnerModule,
  ConfirmDialogModule,
  CalendarModule,
  InputNumberModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'saas-nutri-frontend';
  searchResults: Food[] = [];
  meals: Meal[] = [];
  selectedMealName = '';
  totalKcal = 0;
  totalProtein = 0;
  totalCarbs = 0;
  totalFat = 0;
  totalFiber = 0;
  isLoadingResults = false;
  patientSessionData: PatientData = {
    name: null,
    dob: null,
    goals: null,
    weight: null,
    height: null,
    observations: null,
  };
  availableMeasures: Measure[] = [];
  selectedMealIndex: number | null = null;
  selectedItemIndex: number | null = null;

  private readonly AUTOSAVE_STORAGE_KEY = 'saasNutri_autoSaveData_v1';
  private stateChanged = new Subject<void>();
  private autoSaveSubscription?: Subscription;

  constructor(
    private foodApiService: FoodApiService,
    private messageService: MessageService,
    private pdfExportService: PdfExportService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService
  ) {}

  get hasItemsInAnyMeal(): boolean {
    return (
      this.meals.length > 0 && this.meals.some((meal) => meal.items.length > 0)
    );
  }

  ngOnInit(): void {
    this.loadStateWithConfirmation();
    this.setupAutoSave();

    if (this.meals.length === 0) {
      this.initializeDefaultMeals();
    }
    if (this.meals.length > 0 && !this.selectedMealName) {
      this.selectedMealName = this.meals[0].name;
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
  }

  private initializeDefaultMeals(): void {
    this.meals = [
      { name: 'Café da Manhã', items: [] },
      { name: 'Almoço', items: [] },
      { name: 'Jantar', items: [] },
    ];
  }

  private setupAutoSave(): void {
    this.autoSaveSubscription = this.stateChanged
      .pipe(debounceTime(1500))
      .subscribe(() => {
        this.saveStateToLocalStorage();
      });
  }

  private saveStateToLocalStorage(): void {
    try {
      const stateToSave = {
        meals: this.meals,
        patientSessionData: this.patientSessionData,
        timestamp: new Date().toISOString(),
      };
      const stateString = JSON.stringify(stateToSave);
      localStorage.setItem(this.AUTOSAVE_STORAGE_KEY, stateString);
    } catch (error) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Auto-Save Falhou',
        detail: 'Não foi possível salvar o progresso automaticamente.',
        life: 4000,
      });
    }
  }

  private loadStateFromLocalStorage(): any | null {
    try {
      const savedStateString = localStorage.getItem(this.AUTOSAVE_STORAGE_KEY);
      if (savedStateString) {
        const savedState = JSON.parse(savedStateString);
        if (
          savedState &&
          savedState.meals &&
          savedState.patientSessionData &&
          savedState.timestamp
        ) {
          return savedState;
        } else {
          this.clearAutoSavedState('Dado salvo parece inválido/incompleto.');
        }
      }
    } catch (error) {
      this.clearAutoSavedState('Erro ao ler dado salvo.');
    }
    return null;
  }

  private loadStateWithConfirmation(): void {
    const savedState = this.loadStateFromLocalStorage();

    if (savedState) {
      const savedTimestamp = new Date(savedState.timestamp);
      this.confirmationService.confirm({
        message: `Encontramos um trabalho não salvo de ${savedTimestamp.toLocaleDateString()} ${savedTimestamp.toLocaleTimeString()}. Deseja restaurá-lo?<br><br><small>(Atenção: Este salvamento é temporário e pode ser perdido se o cache do navegador for limpo).</small>`,
        header: 'Restaurar Trabalho?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Restaurar',
        rejectLabel: 'Não, Descartar',
        accept: () => {
          this.meals = savedState.meals;
          if (
            savedState.patientSessionData?.dob &&
            typeof savedState.patientSessionData.dob === 'string'
          ) {
            this.patientSessionData = {
              ...savedState.patientSessionData,
              dob: new Date(savedState.patientSessionData.dob),
            };
          } else {
            this.patientSessionData = savedState.patientSessionData;
          }

          if (this.meals.length > 0) {
            this.selectedMealName = this.meals[0].name;
          } else {
            this.selectedMealName = '';
          }
          this.calculateTotals();
          this.messageService.add({
            severity: 'info',
            summary: 'Restaurado',
            detail: 'Trabalho anterior restaurado com sucesso.',
            life: 3000,
          });
          this.triggerStateChange();
        },
        reject: () => {
          this.clearAutoSavedState();
          if (this.meals.length === 0) {
            this.initializeDefaultMeals();
            if (this.meals.length > 0) {
              this.selectedMealName = this.meals[0].name;
            }
          }
          this.messageService.add({
            severity: 'warn',
            summary: 'Descartado',
            detail: 'Trabalho não salvo anterior foi descartado.',
            life: 3000,
          });
        },
      });
    }
  }

  triggerStateChange(): void {
    this.stateChanged.next();
  }

  clearAutoSavedState(reason?: string): void {
    localStorage.removeItem(this.AUTOSAVE_STORAGE_KEY);
  }

  addMeal(name: string): void {
    const mealName = name.trim();
    if (!mealName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, insira um nome para a refeição.',
        life: 3000,
      });
      return;
    }
    const exists = this.meals.some(
      (meal) => meal.name.toLowerCase() === mealName.toLowerCase()
    );
    if (exists) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Refeição "${mealName}" já existe.`,
        life: 3000,
      });
      return;
    }

    const newMeal: Meal = { name: mealName, items: [] };
    this.meals = [...this.meals, newMeal];
    this.selectedMealName = mealName;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Refeição "${mealName}" adicionada!`,
      life: 2000,
    });
    this.triggerStateChange();
  }

  handleMealNameChange(event: { index: number; newName: string }): void {
    const currentName = this.meals[event.index]?.name;
    const updatedMeals = this.meals.map((meal, index) => {
      if (index === event.index) {
        return { ...meal, name: event.newName };
      }
      return meal;
    });
    this.meals = updatedMeals;
    if (this.selectedMealName === currentName) {
      this.selectedMealName = event.newName;
    }
    this.triggerStateChange();
  }

  handleMealDelete(indexToRemove: number): void {
    const mealNameToDelete = this.meals[indexToRemove]?.name;
    this.meals = this.meals.filter((meal, index) => index !== indexToRemove);
    if (this.selectedMealName === mealNameToDelete) {
      this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
    }
    this.calculateTotals();
    this.triggerStateChange();
  }

  addFoodToCurrentDiet(food: Food): void {
    const newItem: DietItem = {
      food: food,
      displayQuantity: 100,
      selectedMeasure: 'grama',
      quantityInGrams: 100,
    };

    if (!this.selectedMealName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail:
          'Por favor, selecione uma refeição antes de adicionar alimentos.',
        life: 3000,
      });
      if (this.meals.length === 0) {
        this.addMeal('Refeição 1');
      } else {
        this.selectedMealName = this.meals[0].name;
      }
      return;
    }

    let mealFound = false;
    const updatedMeals = this.meals.map((meal) => {
      if (meal.name === this.selectedMealName) {
        mealFound = true;
        const currentItems = Array.isArray(meal.items) ? meal.items : [];
        return { ...meal, items: [...currentItems, newItem] };
      }
      return meal;
    });

    if (!mealFound && updatedMeals.length > 0) {
      const firstMealItems = Array.isArray(updatedMeals[0].items)
        ? updatedMeals[0].items
        : [];
      updatedMeals[0] = {
        ...updatedMeals[0],
        items: [...firstMealItems, newItem],
      };
      this.selectedMealName = updatedMeals[0].name;
    } else if (!mealFound && updatedMeals.length === 0) {
      const firstMeal: Meal = { name: 'Refeição 1', items: [newItem] };
      updatedMeals.push(firstMeal);
      this.selectedMealName = firstMeal.name;
    }

    this.meals = updatedMeals;
    this.calculateTotals();
    this.triggerStateChange();
  }

  handleRemoveFood(indices: { mealIndex: number; itemIndex: number }): void {
    const updatedMeals = this.meals.map((meal, currentMealIndex) => {
      if (currentMealIndex !== indices.mealIndex) {
        return meal;
      }
      const updatedItems = meal.items.filter(
        (item, currentItemIndex) => currentItemIndex !== indices.itemIndex
      );
      return { ...meal, items: updatedItems };
    });
    this.meals = updatedMeals;
    this.calculateTotals();
    this.triggerStateChange();
  }

  handleQuantityChange(): void {
    this.calculateTotals();
    this.triggerStateChange();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files?.length) {
      if (input) input.value = '';
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = reader.result as string;
        const importedData = JSON.parse(content);

        let importedMeals: Meal[] = [];
        let importedPatientData: PatientData | null = null;

        if (
          importedData &&
          typeof importedData === 'object' &&
          !Array.isArray(importedData) &&
          importedData.meals &&
          importedData.patientSessionData
        ) {
          if (!Array.isArray(importedData.meals)) {
            throw new Error(
              'Formato inválido: A propriedade "meals" não é um array no arquivo JSON.'
            );
          }
          if (
            typeof importedData.patientSessionData !== 'object' ||
            importedData.patientSessionData === null
          ) {
            throw new Error(
              'Formato inválido: A propriedade "patientSessionData" não é um objeto no arquivo JSON.'
            );
          }
          importedMeals = importedData.meals as Meal[];
          importedPatientData = importedData.patientSessionData as PatientData;
        } else if (Array.isArray(importedData)) {
          importedMeals = importedData as Meal[];
          importedPatientData = null;
          this.messageService.add({
            severity: 'info',
            summary: 'Aviso',
            detail:
              'Arquivo no formato antigo importado (apenas refeições). Dados do paciente não foram carregados do arquivo.',
            life: 4000,
          });
        } else {
          throw new Error(
            'Arquivo JSON inválido: formato desconhecido. O arquivo deve ser um array de refeições ou um objeto contendo as chaves "meals" e "patientSessionData".'
          );
        }

        this.meals = importedMeals;

        if (importedPatientData) {
          if (
            importedPatientData.dob &&
            typeof importedPatientData.dob === 'string'
          ) {
            try {
              this.patientSessionData = {
                ...importedPatientData,
                dob: new Date(importedPatientData.dob),
              };
            } catch (dateError) {
              this.patientSessionData = { ...importedPatientData, dob: null };
              this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail:
                  'Não foi possível converter a Data de Nascimento do arquivo. Verifique o formato.',
                life: 4000,
              });
            }
          } else {
            this.patientSessionData = importedPatientData;
          }
        } else {
          this.patientSessionData = {
            name: null,
            dob: null,
            goals: null,
            weight: null,
            height: null,
            observations: null,
          };
        }

        this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
        this.calculateTotals();
        this.triggerStateChange();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Plano importado com sucesso!',
          life: 3000,
        });
      } catch (error: unknown) {
        let errorMessage = 'Erro desconhecido ao processar o arquivo.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Falha na Importação',
          detail: errorMessage,
          life: 5000,
        });
      } finally {
        if (input) input.value = '';
      }
    };

    reader.onerror = () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro de Leitura',
        detail: 'Não foi possível ler o arquivo selecionado.',
        life: 5000,
      });
      if (input) input.value = '';
    };

    reader.readAsText(file);
  }
  onPatientDataChange(): void {
    this.triggerStateChange();
  }

  handleSearch(term: string): void {
    if (!term) {
      this.searchResults = [];
      return;
    }
    this.isLoadingResults = true;
    this.searchResults = [];

    this.foodApiService.searchFoods(term).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoadingResults = false;
      },
      error: () => {
        this.isLoadingResults = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na Busca',
          detail: 'Não foi possível buscar alimentos. Tente novamente.',
          life: 3000,
        });
      },
    });
  }

  private calculateTotals(): void {
    this.totalKcal = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;
    this.totalFiber = 0;
    if (!this.meals) return;
    for (const meal of this.meals) {
      if (!meal || !Array.isArray(meal.items)) continue;
      for (const item of meal.items) {
        if (!item || !item.food || typeof item.quantityInGrams !== 'number')
          continue;
        const quantityFactor = item.quantityInGrams / 100;
        this.totalKcal += (item.food.energy_kcal || 0) * quantityFactor;
        this.totalProtein += (item.food.protein_g || 0) * quantityFactor;
        this.totalCarbs += (item.food.carbohydrate_g || 0) * quantityFactor;
        this.totalFat += (item.food.fat_g || 0) * quantityFactor;
        this.totalFiber += (item.food.fiber_g || 0) * quantityFactor;
      }
    }
    this.totalKcal = Math.round(this.totalKcal);
    this.totalProtein = Math.round(this.totalProtein * 10) / 10;
    this.totalCarbs = Math.round(this.totalCarbs * 10) / 10;
    this.totalFat = Math.round(this.totalFat * 10) / 10;
    this.totalFiber = Math.round(this.totalFiber * 10) / 10;
  }

  exportToJson(): void {
    const hasPatientName = !!this.patientSessionData?.name?.trim();
    const hasItems = this.hasItemsInAnyMeal;

    if (!hasPatientName && !hasItems) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há dados do paciente ou itens no plano para exportar.',
        life: 3000,
      });
      return;
    }

    const stateToExport = {
      patientSessionData: this.patientSessionData,
      meals: this.meals,
    };

    const jsonString = JSON.stringify(stateToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    let fileName = 'plano-alimentar.json';
    if (hasPatientName && this.patientSessionData.name) {
      const safeName = this.patientSessionData.name
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.-]/g, '');
      fileName = `plano-${safeName || 'paciente'}.json`;
    }

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Plano exportado para ${fileName}!`,
      life: 3000,
    });
  }

  exportPlanToPdf(): void {
    if (!this.hasItemsInAnyMeal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há itens no plano para gerar PDF.',
        life: 3000,
      });
      return;
    }
    this.calculateTotals();
    const currentTotals: PlanTotals = {
      totalKcal: this.totalKcal,
      totalProtein: this.totalProtein,
      totalCarbs: this.totalCarbs,
      totalFat: this.totalFat,
      totalFiber: this.totalFiber,
    };

    const currentPatientData: PatientData | undefined = this.patientSessionData
      ?.name
      ? this.patientSessionData
      : undefined;

    this.pdfExportService.generateDietPlanPdf(
      this.meals,
      currentTotals,
      currentPatientData
    );

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'PDF gerado com sucesso!',
      life: 3000,
    });
  }

  loadMeasuresForItem(indices: { mealIndex: number; itemIndex: number }): void {
    this.selectedMealIndex = indices.mealIndex;
    this.selectedItemIndex = indices.itemIndex;
    this.availableMeasures = [];

    const item = this.meals[indices.mealIndex]?.items[indices.itemIndex];

    if (!item?.food?.id) {
      this.availableMeasures = [
        { measure_name: 'grama', display_name: 'Grama', gram_equivalent: 1 },
      ];
      return;
    }

    this.foodApiService.getFoodMeasures(item.food.id).subscribe({
      next: (measures) => {
        const hasGrama = measures.some((m) => m.measure_name === 'grama');
        this.availableMeasures = hasGrama
          ? measures
          : [
              {
                measure_name: 'grama',
                display_name: 'Grama',
                gram_equivalent: 1,
              },
              ...measures,
            ];
        this.availableMeasures.sort((a, b) =>
          a.display_name.localeCompare(b.display_name)
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro Medidas',
          detail: 'Não foi possível carregar as medidas caseiras.',
        });
        this.availableMeasures = [
          { measure_name: 'grama', display_name: 'Grama', gram_equivalent: 1 },
        ];
      },
    });
  }

  updateGrams(item: DietItem): void {
    if (!item || !this.availableMeasures) {
      return;
    }

    const selectedMeasureData = this.availableMeasures.find(
      (m) => m.measure_name === item.selectedMeasure
    );

    if (item.selectedMeasure === 'grama' || !selectedMeasureData) {
      item.quantityInGrams = item.displayQuantity;
    } else {
      item.quantityInGrams =
        item.displayQuantity * selectedMeasureData.gram_equivalent;
    }

    item.quantityInGrams = Math.round(item.quantityInGrams * 10) / 10;

    this.calculateTotals();
    this.triggerStateChange();
  }
  handleItemChange(indices: { mealIndex: number; itemIndex: number }): void {
    const item = this.meals[indices.mealIndex]?.items[indices.itemIndex];
    if (item) {
      this.updateGrams(item);
    }
  }
}
