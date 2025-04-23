import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Food } from '../models/food.model';
import { Measure } from '../models/measure.model';

@Injectable({
  providedIn: 'root',
})
export class FoodApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  searchFoods(query: string): Observable<Food[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }

  getFoodMeasures(foodId: string): Observable<Measure[]> {
    const url = `<span class="math-inline">\{this\.apiUrl\}/foods/</span>{encodeURIComponent(foodId)}/measures`;
    return this.http.get<Measure[]>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(
      () => new Error('Erro ao comunicar com a API; por favor tente novamente.')
    );
  }
}
