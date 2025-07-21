import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/user';
import {AppProperties} from '../config/app.properties';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = AppProperties['apiUrl'] + '/user';

  /**
   *
   * @param http
   */
  constructor(private http: HttpClient) {}

  /**
   *
   * @param code
   */
  requestAccess(code: string): Observable<User> {
    let url = this.apiUrl + `/requestAccess?code=${code}`;
    return this.http.get<User>(url);
  }
}

