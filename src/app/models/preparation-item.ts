import {OrderType} from './order-type.enum';
import {Customer} from './customer';

export interface PreparationItem {
   id: number;
   orderId: number;
   tableName: string;
   userName: string;
   productName: string
   quantity: number;
   comment: string;
   reference: string;
   active: boolean;
   orderType: OrderType;
   customer: Customer | null;
   createdAt: string;
}
