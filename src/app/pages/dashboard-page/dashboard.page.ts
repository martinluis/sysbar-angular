import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {APP_SECTION, AppSection} from '../../config/app.config';
import {DashboardItemComponent} from '../../components/dashboard-item/dashboard-item.component';
import {AuthService} from '../../services/auth.service';

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


  constructor(private authService: AuthService) {
  }


  /**
   *
   */
  get activeSections(): AppSection[] {
    return APP_SECTION.filter((section) => this.authService.hasAnyRole(section.roles));
  }
}
