import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private apiUrl = environment.apiUrl + '/printer';


  constructor(private http: HttpClient) {}

  /**
   * /ticket/{orderId}
   */
  printTicket(id: number): Observable<void> {
    return this.http.get<void>(this.apiUrl.concat("/ticket").concat(`/${id}`));
  }
}
