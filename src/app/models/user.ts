import {Role} from './role.enum';

export interface User {
  id: number,
  name: string,
  code: string,
  token: string,
  roles: Role[]
}
