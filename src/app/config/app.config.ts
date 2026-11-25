import {Role} from '../models/role.enum';

export interface AppSection {
  name: string;
  path: string;
  queryParams: {};
  image: string;
  roles: Role[]
}

export const APP_SECTION: AppSection[] = [
  {
    name: 'CONFIG.SECTION.WAITER',
    path: '/waiter',
    queryParams: {},
    image: 'img/waiter-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.WAITER]
  },
  {
    name: 'CONFIG.SECTION.CASHIER',
    path: '/cashier',
    queryParams: {},
    image: 'img/cashier-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER]
  },
  {
    name: 'CONFIG.SECTION.KITCHEN',
    path: '/preparation',
    queryParams: {type: 'FOOD'},
    image: 'img/food-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.KITCHENER]
  },
  {
    name: 'CONFIG.SECTION.BARTENDER',
    path: '/preparation',
    queryParams: {type: 'DRINK'},
    image: 'img/drink-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.BARTENDER]
  },
  {
    name: 'CONFIG.SECTION.EXPENSES',
    path: '/expenses',
    queryParams: {},
    image: 'img/expenses-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER]
  },
  {
    name: 'CONFIG.SECTION.ADMIN',
    path: '/admin',
    queryParams: {},
    image: 'img/admin-icon.svg',
    roles: [Role.ADMIN]
  },
];


export const ADMIN_SECTION: AppSection[] = [
  {
    name: 'CONFIG.SECTION.TABLES',
    path: '/tables',
    queryParams: {},
    image: 'img/tables-icon.svg',
    roles: [Role.ADMIN]
  },
  {
    name: 'CONFIG.SECTION.PRODUCTS',
    path: '/products',
    queryParams: {},
    image: 'img/products-icon.svg',
    roles: [Role.ADMIN]
  },
  {
    name: 'CONFIG.SECTION.USERS',
    path: '/users',
    queryParams: {},
    image: 'img/users-icon.svg',
    roles: [Role.ADMIN]
  },
  {
    name: 'CONFIG.SECTION.CASHCUT',
    path: '/cashcut',
    queryParams: {},
    image: 'img/cashcut-icon.svg',
    roles: [Role.ADMIN]
  },
  {
    name: 'CONFIG.SECTION.SALES_REPORT',
    path: '/reports',
    queryParams: {},
    image: 'img/report-icon.svg',
    roles: [Role.ADMIN]
  }
];
