import { Injectable } from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cashcut} from '../models/cashcut';

@Injectable({
  providedIn: 'root'
})
export class CashcutService {

  private apiUrl = AppProperties['apiUrl'] + '/cashCut/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  getAll(): Observable<Cashcut[]> {
    return this.http.get<Cashcut[]>(this.apiUrl);
  }

  /**
   *
   */
  get(id: number, retrieveType = ""): Observable<Cashcut> {
    let params = new HttpParams()
      .set('mode', retrieveType);
    return this.http.get<Cashcut>(this.apiUrl.concat(id.toString()), {params} );
  }


  /**
   *
   */
  getActive(): Observable<Cashcut> {
    return this.http.get<Cashcut>(this.apiUrl.concat("active"));
  }

  /**
   *
   * @param cashcut
   */
  finish(cashcut: Cashcut): Observable<Cashcut> {
    return this.http.put<Cashcut>(this.apiUrl.concat("finish"), cashcut);
  }
}
