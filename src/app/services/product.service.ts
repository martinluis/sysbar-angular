import { Injectable } from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = AppProperties['apiUrl'] + '/product/';


  /**
   *
   * @param http
   */
  constructor(private http: HttpClient) {}

  /**
   *
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
