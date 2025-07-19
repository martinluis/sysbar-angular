import { Injectable } from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = AppProperties['apiUrl'] + '/product/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
