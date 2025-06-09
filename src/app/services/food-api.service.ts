import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Food } from '../models/food.model';
import { Measure } from '../models/measure.model';

@Injectable({
  providedIn: 'root',
})
export class FoodApiService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  searchFoods(query: string): Observable<Food[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }

  getFoodMeasures(foodId: string): Observable<Measure[]> {
    const url = `${this.apiUrl}/foods/${foodId}/measures`;
    return this.http.get<Measure[]>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let userMessage =
      'Erro ao comunicar com a API. Tente novamente mais tarde.';

    if (error.error instanceof ErrorEvent) {
      userMessage = `Erro de rede ou cliente: ${error.error.message}`;
    } else if (error.status === 0) {
      userMessage =
        'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está online.';
    } else {
      const apiError = error.error as { message?: string; statusCode?: number };
      if (apiError?.message) {
        userMessage = apiError.message;
      } else if (error.statusText) {
        userMessage = `Erro ${error.status}: ${error.statusText}`;
      }
    }

    return throwError(() => new Error(userMessage));
  }
}
