import { Routes } from '@angular/router';
import {AccessPage} from './pages/access-page/access.page';
import {DashboardPage} from './pages/dashboard-page/dashboard.page';
import {WaiterDashboardPage} from './pages/waiter-dashboard-page/waiter-dashboard.page';
import {RoleGuard} from './config/role.guard';
import {Role} from './models/role.enum';
import {ManageOrderPage} from './pages/manage-order-page/manage-order-page';

export const routes: Routes = [
  { path: '', component: AccessPage, },
  { path: 'dashboard',
    component: DashboardPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER] } },
  {
    path: 'waiter/dashboard',
    component: WaiterDashboardPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER] }
  },
  {
    path: 'waiter/order/:tableId',
    component: ManageOrderPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER] }
  },
];
