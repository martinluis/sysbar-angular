import { Routes } from '@angular/router';
import {AccessPage} from './pages/access-page/access.page';
import {DashboardPage} from './pages/dashboard-page/dashboard.page';
import {WaiterPage} from './pages/waiter-page/waiter.page';
import {RoleGuard} from './config/role.guard';
import {Role} from './models/role.enum';
import {OrderPage} from './pages/order-page/order-page';
import {PayPage} from './pages/pay-page/pay-page';
import {PartialPayPage} from './pages/partial-pay-page/partial-pay-page';
import {CashierPage} from './pages/cashier-page/cashier-page';
import {PreparationPage} from './pages/preparation-page/preparation-page';
import {TablesPage} from './pages/tables-page/tables-page';
import {ProductsPage} from './pages/products-page/products-page';
import {ExpensesPage} from './pages/expenses-page/expenses-page';

export const routes: Routes = [
  { path: 'access', component: AccessPage, },
  { path: '', component: AccessPage, },
  { path: 'dashboard',
    component: DashboardPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.WAITER, Role.CASHIER] } },
  {
    path: 'waiter',
    component: WaiterPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.WAITER] }
  },
  {
    path: 'cashier',
    component: CashierPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER] }
  },
  {
    path: 'preparation',
    component: PreparationPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.KITCHENER, Role.BARTENDER] }
  },
  {
    path: 'order',
    component: OrderPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.WAITER] }
  },
  {
    path: 'pay',
    component: PayPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER] }
  },
  {
    path: 'partial-pay',
    component: PartialPayPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER] }
  },
  {
    path: 'expenses',
    component: ExpensesPage,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER] }
  },
  {
    path: 'tables',
    component: TablesPage,
  },
  {
    path: 'products',
    component: ProductsPage,
  },
];
