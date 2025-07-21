import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer';
import {AppProperties} from '../config/app.properties';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  private apiUrl = AppProperties['apiUrl'] + '/customer';

  /**
   *
   * @param http
   */
  constructor(private http: HttpClient) {}


  /**
   *
   * @param phone
   */
  findByPhone(phone: string): Observable<Customer> {
    let url = this.apiUrl + `/findByPhone?phone=${phone}`;
    return this.http.get<Customer>(url);
  }

}
