
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CASHIER = 'CASHIER',
  KITCHENER = 'KITCHENER',
  BARTENDER = 'BARTENDER'
}



export const RoleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Admin',
  [Role.MANAGER]: 'Manager',
  [Role.WAITER]: 'Mesero',
  [Role.CASHIER]: 'Cajero',
  [Role.KITCHENER]: 'Cocinero',
  [Role.BARTENDER]: 'Bartender',
};
