import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppProperties} from '../config/app.properties';
import {Table} from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = AppProperties['apiUrl'] + '/table/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  getAll(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  /**
   *
   */
  get(id: number): Observable<Table> {
    return this.http.get<Table>(this.apiUrl.concat(id.toString()));
  }

  /**
   *
   * @param table
   */
  save(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }

  /**
   *
   * @param id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl.concat(`${id}`));
  }
}

