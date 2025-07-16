import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Role} from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  /**
   *
   * @param authService
   * @param router
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   *
   * @param route
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Role[];

    if (this.authService.hasAnyRole(expectedRoles)) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
