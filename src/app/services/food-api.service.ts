import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodApiService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  searchFoods(query: string): Observable<Food[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { params });
  }
}
