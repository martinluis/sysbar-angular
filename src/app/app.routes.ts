import { Routes } from '@angular/router';
import {AccessPage} from './pages/access-page/access-page';
import {DashboardPage} from './pages/dashboard-page/dashboard.page';

export const routes: Routes = [
  { path: '', component: AccessPage },
  { path: 'dashboard', component: DashboardPage }
];
