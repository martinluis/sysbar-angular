import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Expense} from '../models/expense';
import { environment } from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = environment.apiUrl + '/expense';

  constructor(private http: HttpClient) {}


  /**
   *
   */
  findActives(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl.concat("/findActives"));
  }

  /**
   *
   */
  get(id: number): Observable<Expense> {
    return this.http.get<Expense>(this.apiUrl.concat(id.toString()));
  }

  /**
   *
   * @param expense
   */
  save(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  /**
   *
   * @param id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl.concat(`/${id}`));
  }
}
