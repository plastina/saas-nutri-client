import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'pt-BR' | 'en' | 'fr';

type TranslationParams = Record<string, string | number>;

const STORAGE_KEY = 'saasNutri_language_v1';

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': {
    'header.title': 'Plano Alimentar Personalizado',
    'header.subtitle':
      'Fluxo nutricional com foco no acompanhamento do paciente e na prescrição alimentar.',
    'header.autosave': 'Salvamento automático',
    'header.progress.inProgress': 'Acompanhamento em curso',
    'header.progress.new': 'Nova avaliação',
    'header.actions': 'Ações do plano',
    'header.themeToggle': 'Alternar tema',
    'header.exportJson': 'Exportar JSON',
    'header.exportJsonTooltip': 'Exportar plano como JSON',
    'header.importJson': 'Importar JSON',
    'header.importJsonTooltip': 'Importar plano de arquivo JSON',
    'header.languageAria': 'Selecionar idioma',

    'language.pt-BR': 'Português (Brasil)',
    'language.en': 'English',
    'language.fr': 'Francês',

    'meal.section.title': 'Refeições',
    'meal.default.breakfast': 'Café da manhã',
    'meal.default.lunch': 'Almoço',
    'meal.default.dinner': 'Jantar',
    'meal.new.placeholder': 'Nova refeição',
    'meal.add': 'Adicionar',
    'meal.addAria': 'Adicionar refeição',
    'meal.search.title': 'Buscar e adicionar alimentos',
    'meal.search.placeholder': 'Ex: arroz, feijão, maçã...',
    'meal.selectedFoods': 'Alimentos selecionados:',
    'meal.removeTemp.tooltip': 'Remover da lista temporária',
    'meal.removeTemp.aria': 'Remover da lista temporária',
    'meal.select.placeholder': 'Selecione a refeição',
    'meal.addToMeal': 'Adicionar à refeição',
    'meal.addToMealAria': 'Adicionar alimentos selecionados à refeição',

    'patient.title': 'Dados do paciente',
    'patient.name': 'Nome',
    'patient.weight': 'Peso (kg)',
    'patient.height': 'Altura (cm)',
    'patient.dob': 'Data de nascimento',
    'patient.goals': 'Objetivos',
    'patient.observations': 'Observações',

    'summary.currentPlan': 'Plano alimentar atual',
    'summary.totals': 'Totais do plano',
    'summary.calories': 'Calorias',
    'summary.protein': 'Proteínas',
    'summary.carbs': 'Carboidratos',
    'summary.fat': 'Gorduras',
    'summary.fiber': 'Fibras',
    'summary.totalMeals': 'Total de refeições',
    'summary.empty':
      'Adicione alimentos às refeições para ver os totais nutricionais.',
    'summary.exportPdf': 'Exportar PDF',
    'summary.exportPdfTooltip': 'Exportar plano completo como PDF',

    'builder.editMeal': 'Editar nome da refeição',
    'builder.deleteMeal': 'Excluir refeição',
    'builder.newName': 'Novo nome',
    'builder.save': 'Salvar',
    'builder.saveNewName': 'Salvar novo nome',
    'builder.cancel': 'Cancelar',
    'builder.cancelEdit': 'Cancelar edição',
    'builder.measure': 'Medida',
    'builder.removeItem': 'Remover item',
    'builder.emptyMeal': 'Refeição vazia.',
    'builder.noMeals': 'Nenhuma refeição adicionada ainda.',

    'confirm.deleteMeal.message':
      'Tem certeza de que deseja excluir a refeição "{mealName}" e todos os seus itens?',
    'confirm.deleteMeal.header': 'Confirmar exclusão',
    'confirm.yes': 'Sim',
    'confirm.no': 'Não',

    'confirm.restore.message':
      'Encontramos um trabalho não salvo de {date} {time}. Deseja restaurá-lo?',
    'confirm.restore.header': 'Restaurar trabalho?',

    'toast.warning': 'Atenção',
    'toast.success': 'Sucesso',
    'toast.error': 'Erro',
    'toast.info': 'Informação',

    'toast.searchErrorSummary': 'Erro de busca',
    'toast.noResultsSummary': 'Nenhum resultado',
    'toast.noResultsDetail': 'Nenhum alimento encontrado.',

    'toast.mealExists': 'Refeição "{mealName}" já existe.',
    'toast.mealAdded': 'Refeição "{mealName}" adicionada!',
    'toast.selectMealAndFoods':
      'Selecione uma refeição e alimentos para adicionar.',
    'toast.targetMealNotFound': 'Refeição de destino não encontrada.',
    'toast.foodsAdded': 'Alimentos adicionados à refeição.',

    'toast.measureErrorSummary': 'Erro ao carregar medidas',
    'toast.measureErrorDetail':
      'Não foi possível carregar as medidas caseiras.',

    'toast.importLegacy': 'Formato antigo importado (apenas refeições).',
    'toast.importSuccess': 'Plano importado!',
    'toast.importErrorSummary': 'Falha na importação',
    'toast.importReadErrorSummary': 'Erro de leitura',
    'toast.importReadErrorDetail': 'Não foi possível ler o arquivo.',

    'toast.exportNothing': 'Nada para exportar.',
    'toast.exportSuccess': 'Plano exportado para {fileName}!',

    'toast.pdfNoItems': 'Não há itens para gerar PDF.',
    'toast.pdfSuccess': 'PDF gerado!',

    'toast.restoreDoneSummary': 'Restaurado',
    'toast.restoreDoneDetail': 'Trabalho anterior restaurado.',
  },
  en: {
    'header.title': 'Plano Alimentar Personalizado',
    'header.subtitle':
      'Nutrition workflow focused on patient follow-up and meal prescription.',
    'header.autosave': 'Record autosaved',
    'header.progress.inProgress': 'Follow-up in progress',
    'header.progress.new': 'New assessment',
    'header.actions': 'Plan actions',
    'header.themeToggle': 'Toggle theme',
    'header.exportJson': 'Export JSON',
    'header.exportJsonTooltip': 'Export plan as JSON',
    'header.importJson': 'Import JSON',
    'header.importJsonTooltip': 'Import plan from JSON file',
    'header.languageAria': 'Select language',

    'language.pt-BR': 'Portuguese (Brazil)',
    'language.en': 'English',
    'language.fr': 'French',

    'meal.section.title': 'Meals',
    'meal.default.breakfast': 'Breakfast',
    'meal.default.lunch': 'Lunch',
    'meal.default.dinner': 'Dinner',
    'meal.new.placeholder': 'New meal',
    'meal.add': 'Add',
    'meal.addAria': 'Add meal',
    'meal.search.title': 'Search and add foods',
    'meal.search.placeholder': 'Eg: rice, beans, apple...',
    'meal.selectedFoods': 'Selected foods:',
    'meal.removeTemp.tooltip': 'Remove from temporary list',
    'meal.removeTemp.aria': 'Remove from temporary list',
    'meal.select.placeholder': 'Select meal',
    'meal.addToMeal': 'Add to meal',
    'meal.addToMealAria': 'Add selected foods to meal',

    'patient.title': 'Patient data',
    'patient.name': 'Name',
    'patient.weight': 'Weight (kg)',
    'patient.height': 'Height (cm)',
    'patient.dob': 'Date of birth',
    'patient.goals': 'Goals',
    'patient.observations': 'Observations',

    'summary.currentPlan': 'Current meal plan',
    'summary.totals': 'Plan totals',
    'summary.calories': 'Calories',
    'summary.protein': 'Protein',
    'summary.carbs': 'Carbohydrates',
    'summary.fat': 'Fat',
    'summary.fiber': 'Fiber',
    'summary.totalMeals': 'Total meals',
    'summary.empty': 'Add foods to meals to view nutrition totals.',
    'summary.exportPdf': 'Export PDF',
    'summary.exportPdfTooltip': 'Export full plan as PDF',

    'builder.editMeal': 'Edit meal name',
    'builder.deleteMeal': 'Delete meal',
    'builder.newName': 'New name',
    'builder.save': 'Save',
    'builder.saveNewName': 'Save new name',
    'builder.cancel': 'Cancel',
    'builder.cancelEdit': 'Cancel editing',
    'builder.measure': 'Measure',
    'builder.removeItem': 'Remove item',
    'builder.emptyMeal': 'Empty meal.',
    'builder.noMeals': 'No meals added yet.',

    'confirm.deleteMeal.message':
      'Are you sure you want to delete meal "{mealName}" and all its items?',
    'confirm.deleteMeal.header': 'Confirm deletion',
    'confirm.yes': 'Yes',
    'confirm.no': 'No',

    'confirm.restore.message':
      'We found unsaved work from {date} {time}. Do you want to restore it?',
    'confirm.restore.header': 'Restore work?',

    'toast.warning': 'Warning',
    'toast.success': 'Success',
    'toast.error': 'Error',
    'toast.info': 'Info',

    'toast.searchErrorSummary': 'Search error',
    'toast.noResultsSummary': 'No results',
    'toast.noResultsDetail': 'No food found.',

    'toast.mealExists': 'Meal "{mealName}" already exists.',
    'toast.mealAdded': 'Meal "{mealName}" added!',
    'toast.selectMealAndFoods': 'Select a meal and foods to add.',
    'toast.targetMealNotFound': 'Target meal not found.',
    'toast.foodsAdded': 'Foods added to meal.',

    'toast.measureErrorSummary': 'Measure load error',
    'toast.measureErrorDetail': 'Could not load household measures.',

    'toast.importLegacy': 'Legacy format imported (meals only).',
    'toast.importSuccess': 'Plan imported!',
    'toast.importErrorSummary': 'Import failed',
    'toast.importReadErrorSummary': 'Read error',
    'toast.importReadErrorDetail': 'Could not read the file.',

    'toast.exportNothing': 'Nothing to export.',
    'toast.exportSuccess': 'Plan exported to {fileName}!',

    'toast.pdfNoItems': 'There are no items to generate a PDF.',
    'toast.pdfSuccess': 'PDF generated!',

    'toast.restoreDoneSummary': 'Restored',
    'toast.restoreDoneDetail': 'Previous work restored.',
  },
  fr: {
    'header.title': 'Plano Alimentar Personalizado',
    'header.subtitle':
      'Flux nutritionnel axe sur le suivi du patient et la prescription alimentaire.',
    'header.autosave': 'Dossier enregistre automatiquement',
    'header.progress.inProgress': 'Suivi en cours',
    'header.progress.new': 'Nouvelle evaluation',
    'header.actions': 'Actions du plan',
    'header.themeToggle': 'Changer de theme',
    'header.exportJson': 'Exporter JSON',
    'header.exportJsonTooltip': 'Exporter le plan en JSON',
    'header.importJson': 'Importer JSON',
    'header.importJsonTooltip': 'Importer un plan depuis un fichier JSON',
    'header.languageAria': 'Selectionner la langue',

    'language.pt-BR': 'Portugais (Bresil)',
    'language.en': 'Anglais',
    'language.fr': 'Francais',

    'meal.section.title': 'Repas',
    'meal.default.breakfast': 'Petit-dejeuner',
    'meal.default.lunch': 'Dejeuner',
    'meal.default.dinner': 'Diner',
    'meal.new.placeholder': 'Nouveau repas',
    'meal.add': 'Ajouter',
    'meal.addAria': 'Ajouter un repas',
    'meal.search.title': 'Rechercher et ajouter des aliments',
    'meal.search.placeholder': 'Ex: riz, haricots, pomme...',
    'meal.selectedFoods': 'Aliments selectionnes :',
    'meal.removeTemp.tooltip': 'Retirer de la liste temporaire',
    'meal.removeTemp.aria': 'Retirer de la liste temporaire',
    'meal.select.placeholder': 'Selectionner un repas',
    'meal.addToMeal': 'Ajouter au repas',
    'meal.addToMealAria': 'Ajouter les aliments selectionnes au repas',

    'patient.title': 'Donnees du patient',
    'patient.name': 'Nom',
    'patient.weight': 'Poids (kg)',
    'patient.height': 'Taille (cm)',
    'patient.dob': 'Date de naissance',
    'patient.goals': 'Objectifs',
    'patient.observations': 'Observations',

    'summary.currentPlan': 'Plan alimentaire actuel',
    'summary.totals': 'Totaux du plan',
    'summary.calories': 'Calories',
    'summary.protein': 'Proteines',
    'summary.carbs': 'Glucides',
    'summary.fat': 'Lipides',
    'summary.fiber': 'Fibres',
    'summary.totalMeals': 'Total des repas',
    'summary.empty':
      'Ajoutez des aliments aux repas pour voir les totaux nutritionnels.',
    'summary.exportPdf': 'Exporter PDF',
    'summary.exportPdfTooltip': 'Exporter le plan complet en PDF',

    'builder.editMeal': 'Modifier le nom du repas',
    'builder.deleteMeal': 'Supprimer le repas',
    'builder.newName': 'Nouveau nom',
    'builder.save': 'Enregistrer',
    'builder.saveNewName': 'Enregistrer le nouveau nom',
    'builder.cancel': 'Annuler',
    'builder.cancelEdit': 'Annuler la modification',
    'builder.measure': 'Mesure',
    'builder.removeItem': 'Retirer l item',
    'builder.emptyMeal': 'Repas vide.',
    'builder.noMeals': 'Aucun repas ajoute pour le moment.',

    'confirm.deleteMeal.message':
      'Voulez-vous vraiment supprimer le repas "{mealName}" et tous ses elements?',
    'confirm.deleteMeal.header': 'Confirmer la suppression',
    'confirm.yes': 'Oui',
    'confirm.no': 'Non',

    'confirm.restore.message':
      'Nous avons trouve un travail non enregistre du {date} {time}. Voulez-vous le restaurer?',
    'confirm.restore.header': 'Restaurer le travail ?',

    'toast.warning': 'Attention',
    'toast.success': 'Succes',
    'toast.error': 'Erreur',
    'toast.info': 'Info',

    'toast.searchErrorSummary': 'Erreur de recherche',
    'toast.noResultsSummary': 'Aucun resultat',
    'toast.noResultsDetail': 'Aucun aliment trouve.',

    'toast.mealExists': 'Le repas "{mealName}" existe deja.',
    'toast.mealAdded': 'Repas "{mealName}" ajoute !',
    'toast.selectMealAndFoods':
      'Selectionnez un repas et des aliments a ajouter.',
    'toast.targetMealNotFound': 'Repas cible introuvable.',
    'toast.foodsAdded': 'Aliments ajoutes au repas.',

    'toast.measureErrorSummary': 'Erreur de chargement des mesures',
    'toast.measureErrorDetail': 'Impossible de charger les mesures menageres.',

    'toast.importLegacy': 'Format ancien importe (repas uniquement).',
    'toast.importSuccess': 'Plan importe !',
    'toast.importErrorSummary': 'Echec de l importation',
    'toast.importReadErrorSummary': 'Erreur de lecture',
    'toast.importReadErrorDetail': 'Impossible de lire le fichier.',

    'toast.exportNothing': 'Rien a exporter.',
    'toast.exportSuccess': 'Plan exporte vers {fileName} !',

    'toast.pdfNoItems': 'Aucun element pour generer le PDF.',
    'toast.pdfSuccess': 'PDF genere !',

    'toast.restoreDoneSummary': 'Restaure',
    'toast.restoreDoneDetail': 'Travail precedent restaure.',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageSubject = new BehaviorSubject<AppLanguage>('en');
  readonly language$ = this.languageSubject.asObservable();

  constructor() {
    const initialLanguage = this.resolveInitialLanguage();
    this.setLanguage(initialLanguage);
  }

  get currentLanguage(): AppLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  t(key: string, params?: TranslationParams): string {
    const language = this.currentLanguage;
    const languageMap = TRANSLATIONS[language] || TRANSLATIONS.en;
    const fallbackMap = TRANSLATIONS.en;
    let text = languageMap[key] ?? fallbackMap[key] ?? key;

    if (!params) return text;

    Object.entries(params).forEach(([param, value]) => {
      text = text.replaceAll(`{${param}}`, String(value));
    });

    return text;
  }

  private resolveInitialLanguage(): AppLanguage {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (this.isSupportedLanguage(fromStorage)) {
      return fromStorage;
    }

    const browser = navigator.language || 'en';
    if (browser.toLowerCase().startsWith('pt')) return 'pt-BR';
    if (browser.toLowerCase().startsWith('fr')) return 'fr';
    return 'en';
  }

  private isSupportedLanguage(value: string | null): value is AppLanguage {
    return value === 'pt-BR' || value === 'en' || value === 'fr';
  }
}
