import {OrderType} from './order-type.enum';
import {Customer} from './customer';
import {PreparationItem} from './preparation-item';

export interface Preparation {
  id: number
  items: PreparationItem[];
  tableName: string;
  userName: string;
  orderType: OrderType;
  customer: Customer | null;
  reference: string;
  createdAt: string | null;
}
