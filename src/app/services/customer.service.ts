import {Injectable, input, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Customer} from '../models/customer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.apiUrl + '/customer';

  private readonly _customerFormState = signal<{
    valid: boolean;
    customer: Customer | null;
  }>({ valid: false, customer: null });

  readonly customerFormState = this._customerFormState.asReadonly();


  /**
   * Constructor
   * @param http
   */
  constructor(private http: HttpClient) {}


  /**
   * Find a customer by phone number.
   * @param phone
   */
  findByPhone(phone: string): Observable<Customer> {
    let url = this.apiUrl + `/findByPhone?phone=${phone}`;
    return this.http.get<Customer>(url);
  }

  /**
   * Set the customer form state.
   * @param valid
   * @param customer
   */
  setCustomerFormState(valid: boolean, customer: Customer | null): void {
    this._customerFormState.set({ valid, customer });
  }

}
