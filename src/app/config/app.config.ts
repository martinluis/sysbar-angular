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
    name: 'Mesero',
    path: '/waiter',
    queryParams: {},
    image: 'img/waiter-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.WAITER]
  },
  {
    name: 'Cajero',
    path: '/cashier',
    queryParams: {},
    image: 'img/cashier-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.CASHIER]
  },
  {
    name: 'Cocinero',
    path: '/preparation',
    queryParams: {type: 'FOOD'},
    image: 'img/food-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.KITCHENER]
  },
  {
    name: 'Bartender',
    path: '/preparation',
    queryParams: {type: 'DRINK'},
    image: 'img/drink-icon.svg',
    roles: [Role.ADMIN, Role.MANAGER, Role.BARTENDER]
  }
];
