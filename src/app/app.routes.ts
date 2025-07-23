import { Routes } from '@angular/router';
import {AccessPage} from './pages/access-page/access.page';
import {DashboardPage} from './pages/dashboard-page/dashboard.page';
import {WaiterDashboardPage} from './pages/waiter-dashboard-page/waiter-dashboard.page';
import {RoleGuard} from './config/role.guard';
import {Role} from './models/role.enum';
import {OrderPage} from './pages/order-page/order-page';
import {PayPage} from './pages/pay-page/pay-page';
import {PartialPayPage} from './pages/partial-pay-page/partial-pay-page';

export const routes: Routes = [
  { path: '', component: AccessPage, },
  { path: 'dashboard',
    component: DashboardPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER, Role.CASHIER] } },
  {
    path: 'waiter/dashboard',
    component: WaiterDashboardPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER, Role.CASHIER] }
  },
  {
    path: 'order',
    component: OrderPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.WAITER, Role.CASHIER] }
  },
  {
    path: 'pay',
    component: PayPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.CASHIER] }
  },
  {
    path: 'partial-pay',
    component: PartialPayPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.CASHIER] }
  },
];
