import {Order} from './order';
import {Expense} from './expense';

export interface Cashcut {

  id: number | null;
  initialDate: string;
  finalDate: string;
  initialAmount: number | 0;
  totalOrders: number | 0;
  totalExpenses: number | 0;
  total: number | 0;
  orders: Order[] | null;
  expenses: Expense[] | null;

}
