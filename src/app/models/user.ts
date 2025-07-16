import {Role} from './role.enum';

export interface User {
  id: number,
  name: string,
  token: string,
  roles: Role[]
}
