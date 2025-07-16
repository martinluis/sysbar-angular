import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/user';
import {AppProperties} from '../config/app.properties';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  /**
   *
   * @param code
   */
  requestAccess(code: string): Observable<User> {
    const apiUrl = AppProperties['apiUrl'] + '/user';
    let url = apiUrl + `/requestAccess?code=${code}`;
    return this.http.get<User>(url);
  }
}

