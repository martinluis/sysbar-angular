import { Component } from '@angular/core';
import {DashboardItemComponent} from "../../components/dashboard-item/dashboard-item.component";
import {HeaderComponent} from "../../components/header/header.component";
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ADMIN_SECTION, AppSection} from '../../config/app.config';

@Component({
  selector: 'app-admin-page',
    imports: [
        DashboardItemComponent,
        HeaderComponent
    ],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage {

  /**
   *
   * @param authService
   * @param router
   */
  constructor(private authService: AuthService, private router: Router) {
  }


  /**
   *
   */
  get activeSections(): AppSection[] {
    const sections = ADMIN_SECTION.filter((section) => this.authService.hasAnyRole(section.roles));
    if (sections.length === 1) {
      this.router.navigate([sections[0].path], {
        queryParams: sections[0].queryParams
      });
    }
    if (sections.length === 0) {
      this.router.navigate(['/']);
    }
    return sections
  }

}
