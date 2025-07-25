import { Injectable } from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient} from '@angular/common/http';
import {PreparationItem} from '../models/preparation-item';
import {interval, Observable, startWith, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreparationService {

  private apiUrl = AppProperties['apiUrl'] + '/preparationQueue/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  findActive(): Observable<PreparationItem[]> {
    return this.http.get<PreparationItem[]>(this.apiUrl.concat("findActive"));
  }

  /**
   *
   */
  finish(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}${id}/finish`, null, {
      responseType: 'text' as 'json' // important cast to avoid error
    });
  }

  /**
   *
   */
  getLiveData() {
    return interval(10000).pipe( // every 5 seconds
      startWith(0),
      switchMap(() => this.findActive() )
    );
  }


}
