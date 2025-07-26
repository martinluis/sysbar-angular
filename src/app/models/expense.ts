import {User} from './user';

export interface Expense {
  id: number | null,
  description: string,
  amount: number,
  user: User,
}
