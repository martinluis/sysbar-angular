import {Table} from './table';
import {OrderType} from './order-type.enum';
import {OrderStatus} from './order-status.enum';
import {OrderItem} from './order-item';
import {User} from './user';

export interface Order {
  id: number;
  items: OrderItem[];
  table: Table;
  user: User;
  orderType: OrderType;
  total: number;
  status: OrderStatus;
}
