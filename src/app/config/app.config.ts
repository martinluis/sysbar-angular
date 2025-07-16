import {Role} from '../models/role.enum';

export interface AppSection {
  name: string;
  path: string;
  image: string;
  roles: Role[]
}

export const APP_SECTION: AppSection[] = [
  {
    name: 'Mesero',
    path: '/waiter/dashboard',
    image: 'img/waiter-icon.svg',
    roles: [Role.ADMIN, Role.WAITER]
  },
  {
    name: 'Cajero',
    path: '/',
    image: 'img/cashier-icon.svg',
    roles: [Role.ADMIN, Role.CASHIER]
  },
  {
    name: 'Cocinero',
    path: '/',
    image: 'img/food-icon.svg',
    roles: [Role.ADMIN, Role.KITCHENER]
  },
  {
    name: 'Bartender',
    path: '/',
    image: 'img/drink-icon.svg',
    roles: [Role.ADMIN, Role.BARTENDER]
  }
];
