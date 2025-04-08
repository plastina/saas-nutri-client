import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DietBuilderComponent } from './components/diet-builder/diet-builder.component';
import { FoodListComponent } from './components/food-list/food-list.component';
import { FoodSearchComponent } from './components/food-search/food-search.component';
import { DietItem } from './models/diet-item.model';
import { Food } from './models/food.model';
import { Meal } from './models/meal.model';
import { FoodApiService } from './services/food-api.service';

const APP_COMPONENT_IMPORTS = [
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
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...APP_COMPONENT_IMPORTS],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AppComponent implements OnInit {
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

  constructor(
    private foodApiService: FoodApiService,
    private messageService: MessageService
  ) {}

  get hasItemsInAnyMeal(): boolean {
    return (
      this.meals.length > 0 && this.meals.some((meal) => meal.items.length > 0)
    );
  }

  ngOnInit(): void {
    if (this.meals.length === 0) {
      this.meals = [
        { name: 'Café da Manhã', items: [] },
        { name: 'Almoço', items: [] },
        { name: 'Jantar', items: [] },
      ];
    }
    if (this.meals.length > 0 && !this.selectedMealName) {
      this.selectedMealName = this.meals[0].name;
    }
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
  }

  handleMealNameChange(event: { index: number; newName: string }): void {
    const currentName = this.meals[event.index]?.name;
    console.log(
      `AppComponent: Mudando nome da refeição ${event.index} de "${currentName}" para "${event.newName}"`
    );

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
        console.log('>>> DADOS RECEBIDOS DA API:', results); // <<<< Adicionar este log
        this.searchResults = results; // Atribuição acontece aqui
        this.isLoadingResults = false;
      },
      error: () => {
        // ... (tratamento de erro existente) ...
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

  handleMealDelete(indexToRemove: number): void {
    const mealNameToDelete = this.meals[indexToRemove]?.name;
    console.log(
      `AppComponent: Removendo refeição ${indexToRemove} "${mealNameToDelete}"`
    );

    this.meals = this.meals.filter((meal, index) => index !== indexToRemove);

    if (this.selectedMealName === mealNameToDelete) {
      this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
    }

    this.calculateTotals();
    console.log('Refeições Atualizadas após exclusão:', this.meals);
  }

  addFoodToCurrentDiet(food: Food): void {
    const newItem: DietItem = { food: food, quantity: 100 };

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
    }

    let mealFound = false;
    const updatedMeals = this.meals.map((meal) => {
      if (meal.name === this.selectedMealName) {
        mealFound = true;
        return { ...meal, items: [...meal.items, newItem] };
      }
      return meal;
    });

    if (!mealFound && updatedMeals.length > 0) {
      console.warn(
        `Refeição selecionada "${this.selectedMealName}" não encontrada. Adicionando na primeira.`
      );
      updatedMeals[0] = {
        ...updatedMeals[0],
        items: [...updatedMeals[0].items, newItem],
      };
      this.selectedMealName = updatedMeals[0].name;
    } else if (!mealFound && updatedMeals.length === 0) {
      const firstMeal: Meal = { name: 'Refeição 1', items: [newItem] };
      updatedMeals.push(firstMeal);
      this.selectedMealName = firstMeal.name;
    }

    this.meals = updatedMeals;
    this.calculateTotals();
    console.log('Refeições Atuais:', this.meals);
  }

  handleRemoveFood(indices: { mealIndex: number; itemIndex: number }): void {
    console.log('AppComponent: Removendo item:', indices);

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
    console.log('Dieta Atualizada após remoção:', this.meals);
  }

  private calculateTotals(): void {
    this.totalKcal = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;
    this.totalFiber = 0;
    for (const meal of this.meals) {
      for (const item of meal.items) {
        const quantityFactor = item.quantity / 100;
        this.totalKcal += item.food.energy_kcal * quantityFactor;
        this.totalProtein += item.food.protein_g * quantityFactor;
        this.totalCarbs += item.food.carbohydrate_g * quantityFactor;
        this.totalFat += item.food.fat_g * quantityFactor;
        this.totalFiber += item.food.fiber_g * quantityFactor;
      }
    }
  }

  handleQuantityChange(): void {
    console.log('AppComponent: Quantidade alterada, recalculando totais...');
    this.calculateTotals();
  }

  exportToJson(): void {
    if (!this.hasItemsInAnyMeal) {
      return;
    } // Usar o getter aqui
    const jsonString = JSON.stringify(this.meals, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plano-alimentar.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Plano exportado com sucesso!',
      life: 3000,
    });
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
        const importedMeals = JSON.parse(content);

        if (!Array.isArray(importedMeals)) {
          throw new Error(
            'Arquivo JSON inválido: não é um array de refeições.'
          );
        }
        if (
          importedMeals.length > 0 &&
          (importedMeals[0].name === undefined ||
            importedMeals[0].items === undefined ||
            !Array.isArray(importedMeals[0].items))
        ) {
          throw new Error(
            'Arquivo JSON inválido: formato de refeição incorreto.'
          );
        }

        this.meals = importedMeals as Meal[];
        // Após importar, talvez redefinir a seleção para a primeira refeição importada?
        this.selectedMealName = this.meals.length > 0 ? this.meals[0].name : '';
        this.calculateTotals();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Plano importado com sucesso!',
          life: 3000,
        });
      } catch (error: unknown) {
        console.error('Erro ao importar ou parsear JSON:', error);
        let errorMessage = 'Erro desconhecido ao processar arquivo.';
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
      console.error('Erro ao ler arquivo:', reader.error);
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
} // Fim da classe
