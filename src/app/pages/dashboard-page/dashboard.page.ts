import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {APP_SECTION, AppSection} from '../../config/app.config';
import {DashboardItemComponent} from '../../components/dashboard-item/dashboard-item.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard.page',
  imports: [
    HeaderComponent,
    DashboardItemComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage {

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
    const sections = APP_SECTION.filter((section) => this.authService.hasAnyRole(section.roles));
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
