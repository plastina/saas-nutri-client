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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { EMPTY, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { MealManagementComponent } from './components/meal-management/meal-management.component';
import { PatientSectionComponent } from './components/patient-section/patient-section.component';
import { PlanSummaryComponent } from './components/plan-summary/plan-summary.component';
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
  ButtonModule,
  InputTextModule,
  Textarea,
  DropdownModule,
  DividerModule,
  ToolbarModule,
  ToastModule,
  ProgressSpinnerModule,
  ConfirmDialogModule,
  CalendarModule,
  InputNumberModule,
  AutoCompleteModule,
  TooltipModule,
  PatientSectionComponent,
  MealManagementComponent,
  PlanSummaryComponent,
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
  meals: Meal[] = [];
  selectedMealName = '';
  patientSessionData: PatientData = {
    name: null,
    dob: null,
    goals: null,
    weight: null,
    height: null,
    observations: null,
  };

  foodSearchSuggestions: Food[] = [];
  selectedFoodAutoComplete: Food | string | null = null;
  selectedFoodsForAdding: Food[] = [];
  isLoadingResults = false;

  availableMeasures: Measure[] = [];
  selectedMealIndex: number | null = null;
  selectedItemIndex: number | null = null;

  totalKcal = 0;
  totalProtein = 0;
  totalCarbs = 0;
  totalFat = 0;
  totalFiber = 0;

  private readonly AUTOSAVE_STORAGE_KEY = 'saasNutri_autoSaveData_v1';
  private stateChanged = new Subject<void>();
  private autoSaveSubscription?: Subscription;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

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
    this.setupSearchDebounce();
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
    this.searchSubscription?.unsubscribe();
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
      .subscribe(() => this.saveStateToLocalStorage());
  }

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.length < 3) {
            this.foodSearchSuggestions = [];
            return EMPTY;
          }
          this.isLoadingResults = true;
          return this.foodApiService.searchFoods(term).pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro Busca',
                detail: err.message,
              });
              this.isLoadingResults = false;
              return EMPTY;
            })
          );
        })
      )
      .subscribe((results) => {
        this.foodSearchSuggestions = results;
        this.isLoadingResults = false;
        if (results.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Nenhum Resultado',
            detail: `Nenhum alimento encontrado.`,
          });
        }
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
      console.error('Error saving state:', error);
    }
  }

  private loadStateFromLocalStorage(): any | null {
    try {
      const savedStateString = localStorage.getItem(this.AUTOSAVE_STORAGE_KEY);
      if (savedStateString) {
        const savedState = JSON.parse(savedStateString);
        if (savedState && savedState.meals && savedState.patientSessionData) {
          return savedState;
        }
      }
    } catch (error) {
      console.error('Error reading state:', error);
    }
    return null;
  }

  private loadStateWithConfirmation(): void {
    const savedState = this.loadStateFromLocalStorage();
    if (savedState) {
      const savedTimestamp = new Date(savedState.timestamp);
      this.confirmationService.confirm({
        message: `Encontramos um trabalho não salvo de ${savedTimestamp.toLocaleDateString()} ${savedTimestamp.toLocaleTimeString()}. Deseja restaurá-lo?`,
        header: 'Restaurar Trabalho?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
          this.meals = savedState.meals;
          this.patientSessionData = this.parsePatientDataOnLoad(
            savedState.patientSessionData
          );
          this.selectedMealName =
            this.meals.length > 0 ? this.meals[0].name : '';
          this.calculateTotals();
          this.messageService.add({
            severity: 'info',
            summary: 'Restaurado',
            detail: 'Trabalho anterior restaurado.',
          });
          this.triggerStateChange();
        },
        reject: () => {
          this.clearAutoSavedState();
          if (this.meals.length === 0) {
            this.initializeDefaultMeals();
          }
        },
      });
    }
  }

  private parsePatientDataOnLoad(data: any): PatientData {
    if (data?.dob && typeof data.dob === 'string') {
      try {
        return { ...data, dob: new Date(data.dob) };
      } catch (e) {
        return { ...data, dob: null };
      }
    }
    return (
      data || {
        name: null,
        dob: null,
        goals: null,
        weight: null,
        height: null,
        observations: null,
      }
    );
  }

  triggerStateChange(): void {
    this.stateChanged.next();
  }
  clearAutoSavedState(reason?: string): void {
    localStorage.removeItem(this.AUTOSAVE_STORAGE_KEY);
  }

  addMeal(name: string): void {
    const mealName = name.trim();
    if (!mealName) return;
    const exists = this.meals.some(
      (m) => m.name.toLowerCase() === mealName.toLowerCase()
    );
    if (exists) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Refeição "${mealName}" já existe.`,
      });
      return;
    }
    this.meals = [...this.meals, { name: mealName, items: [] }];
    this.selectedMealName = mealName;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Refeição "${mealName}" adicionada!`,
    });
    this.triggerStateChange();
  }

  handleMealNameChange(event: { index: number; newName: string }): void {
    const currentName = this.meals[event.index]?.name;
    const updatedMeals = this.meals.map((meal, index) =>
      index === event.index ? { ...meal, name: event.newName } : meal
    );
    this.meals = updatedMeals;
    if (this.selectedMealName === currentName) {
      this.selectedMealName = event.newName;
    }
    this.triggerStateChange();
  }

  handleMealDelete(indexToRemove: number): void {
    const mealNameToDelete = this.meals[indexToRemove]?.name;
    this.meals = this.meals.filter((_, index) => index !== indexToRemove);
    if (this.selectedMealName === mealNameToDelete) {
      this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
    }
    this.calculateTotals();
    this.triggerStateChange();
  }

  onPatientDataChange(): void {
    this.triggerStateChange();
  }

  searchFoodsByTerm(query: string): void {
    this.searchSubject.next(query);
  }

  onFoodSelectedFromAutocomplete(food: Food): void {
    if (food && food.id && typeof food === 'object') {
      if (!this.selectedFoodsForAdding.some((f) => f.id === food.id)) {
        this.selectedFoodsForAdding.push(food);
      }
    }
    this.selectedFoodAutoComplete = '';
    this.foodSearchSuggestions = [];
  }

  removeFoodFromTemporaryList(index: number): void {
    this.selectedFoodsForAdding.splice(index, 1);
  }

  addAllSelectedFoodsToMeal(): void {
    if (!this.selectedMealName || this.selectedFoodsForAdding.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma refeição e alimentos para adicionar.',
      });
      return;
    }
    const targetMeal = this.meals.find(
      (meal) => meal.name === this.selectedMealName
    );
    if (!targetMeal) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Refeição alvo não encontrada.',
      });
      return;
    }
    if (!Array.isArray(targetMeal.items)) {
      targetMeal.items = [];
    }

    this.selectedFoodsForAdding.forEach((food) => {
      const newItem: DietItem = {
        food: food,
        displayQuantity: 100,
        selectedMeasure: 'grama',
        quantityInGrams: 100,
      };
      targetMeal.items.push(newItem);
    });

    this.selectedFoodsForAdding = [];
    this.calculateTotals();
    this.triggerStateChange();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Alimentos adicionados à refeição.',
    });
  }

  loadMeasuresForItem(indices: { mealIndex: number; itemIndex: number }): void {
    this.selectedMealIndex = indices.mealIndex;
    this.selectedItemIndex = indices.itemIndex;
    this.availableMeasures = [];
    const item = this.meals[indices.mealIndex]?.items[indices.itemIndex];
    const foodId = item?.food?.id;

    if (!foodId) {
      this.availableMeasures = [
        { measure_name: 'grama', display_name: 'Grama', gram_equivalent: 1 },
      ];
      return;
    }

    this.foodApiService.getFoodMeasures(foodId).subscribe({
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
          detail:
            err.message || 'Não foi possível carregar as medidas caseiras.',
        });
        this.availableMeasures = [
          { measure_name: 'grama', display_name: 'Grama', gram_equivalent: 1 },
        ];
      },
    });
  }

  updateGrams(item: DietItem): void {
    if (!item || !this.availableMeasures) return;
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

  handleRemoveFood(indices: { mealIndex: number; itemIndex: number }): void {
    if (this.meals[indices.mealIndex]?.items) {
      this.meals[indices.mealIndex].items.splice(indices.itemIndex, 1);
      this.calculateTotals();
      this.triggerStateChange();
    }
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
          if (!Array.isArray(importedData.meals))
            throw new Error('Inválido: "meals" não é array.');
          if (
            typeof importedData.patientSessionData !== 'object' ||
            importedData.patientSessionData === null
          )
            throw new Error('Inválido: "patientSessionData" não é objeto.');
          importedMeals = importedData.meals as Meal[];
          importedPatientData = importedData.patientSessionData as PatientData;
        } else if (Array.isArray(importedData)) {
          importedMeals = importedData as Meal[];
          importedPatientData = null;
          this.messageService.add({
            severity: 'info',
            summary: 'Aviso',
            detail: 'Formato antigo importado (apenas refeições).',
            life: 4000,
          });
        } else {
          throw new Error('Arquivo JSON inválido: formato desconhecido.');
        }
        this.meals = importedMeals;
        this.patientSessionData =
          this.parsePatientDataOnLoad(importedPatientData);
        this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
        this.calculateTotals();
        this.triggerStateChange();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Plano importado!',
          life: 3000,
        });
      } catch (error: unknown) {
        let errorMessage = 'Erro desconhecido ao processar arquivo.';
        if (error instanceof Error) errorMessage = error.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Falha Importação',
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
        summary: 'Erro Leitura',
        detail: 'Não foi possível ler o arquivo.',
        life: 5000,
      });
      if (input) input.value = '';
    };
    reader.readAsText(file);
  }

  exportToJson(): void {
    const hasPatientName = !!this.patientSessionData?.name?.trim();
    const hasItems = this.hasItemsInAnyMeal;
    if (!hasPatientName && !hasItems) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nada para exportar.',
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
    });
  }

  exportPlanToPdf(): void {
    if (!this.hasItemsInAnyMeal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há itens para gerar PDF.',
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
      detail: 'PDF gerado!',
    });
  }
}
