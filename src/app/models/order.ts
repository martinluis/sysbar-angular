import {Table} from './table';
import {OrderType} from './order-type.enum';
import {OrderStatus} from './order-status.enum';
import {OrderItem} from './order-item';
import {User} from './user';
import {Customer} from './customer';

export interface Order {
  id: number | null;
  items: OrderItem[];
  table: Table | null;
  user: User;
  orderType: OrderType;
  total: number;
  status: OrderStatus;
  customer: Customer | null;
}
