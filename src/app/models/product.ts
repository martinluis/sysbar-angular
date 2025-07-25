import {ProductType} from './product-type.enum';

export interface Product {
  id: number | null,
  name: string,
  price: number,
  type: ProductType,
  stock: number
}
