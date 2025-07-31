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
  getAll(startDate = "", endDate = ""): Observable<Cashcut[]> {
    if (startDate !== "" && endDate !== "") {
      let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
      return this.http.get<Cashcut[]>(this.apiUrl, { params });
    }
    return this.http.get<Cashcut[]>(this.apiUrl);
  }

  /**
   *
   */
  get(id: number, includeDetails = false): Observable<Cashcut> {
    let params = new HttpParams()
      .set('includeDetails', includeDetails);
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
  finish(): Observable<Cashcut> {
    return this.http.put<Cashcut>(this.apiUrl.concat("active/finish"), null);
  }

  /**
   *
   * @param cashcut
   */
  createActive(cashcut: Cashcut): Observable<Cashcut> {
    return this.http.post<Cashcut>(this.apiUrl.concat("active"), cashcut);
  }
}
