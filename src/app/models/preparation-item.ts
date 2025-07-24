import {OrderType} from './order-type.enum';
import {Customer} from './customer';
import {ProductType} from './product-type.enum';

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
   productType: ProductType
   customer: Customer | null;
   createdAt: string;
}
