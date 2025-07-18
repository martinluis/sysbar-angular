import { Injectable } from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = AppProperties['apiUrl'] + '/order/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  getByTable(tableId: number): Observable<Order> {
    let params = new HttpParams();
    params = params.set('tableId', tableId);
    return this.http.get<Order>(this.apiUrl.concat("findByTable"), {params});
  }

}
