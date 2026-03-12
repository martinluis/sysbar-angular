import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = environment.apiUrl + '/user';

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


  /**
   *
   */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }


  /**
   *
   * @param user
   */
  save(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   *
   * @param id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl.concat(`/${id}`));
  }
}

