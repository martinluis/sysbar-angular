import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs';
import {Role} from '../models/role.enum';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

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
  constructor(private router: Router) {
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
    this.router.navigate(['/access']); // Or wherever your login page is
  }

  /**
   *
   */
  getUser(): User {
    const user = this.getUserOrNull();
    if (!user) {
      this.router.navigate(['/access']);
      throw new Error('Unauthenticated');
    }
    return user;
  }


  /**
   *
   * @private
   */
  private getUserOrNull(): User | null {
    const token = localStorage.getItem(this.USER_TOKEN);
    if (!token) return null;
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      this.currentUserSubject.next(decodedToken.user);
      return this.currentUserSubject.getValue();
    } catch {
      this.deleteUser();
      return null;
    }
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
