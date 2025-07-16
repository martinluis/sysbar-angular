import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs';
import {Role} from '../models/role.enum';
import {jwtDecode} from 'jwt-decode';

export interface DecodedToken {
  user: User;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private USER_TOKEN = 'token';


  /**
   *
   */
  constructor() {
    this.getUser()
  }

  /**
   *
   * @param user
   */
  setUser(user: User) {
    localStorage.setItem(this.USER_TOKEN, user.token);
    this.currentUserSubject.next(user);
  }

  /**
   *
   */
  deleteUser() {
    localStorage.removeItem(this.USER_TOKEN)
    this.currentUserSubject.next(null);
  }

  /**
   *
   */
  getUser(): User | null {
    const token = localStorage.getItem(this.USER_TOKEN);
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken) {
        this.currentUserSubject.next(decodedToken.user);
      }
    }
    return this.currentUserSubject.getValue();
  }

  /**
   *
   * @param role
   */
  hasRole(role: Role): boolean {
    return this.getUser()?.roles.includes(role) ?? false
  }

  /**
   *
   * @param roles
   */
  hasAnyRole(roles: Role[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

}
