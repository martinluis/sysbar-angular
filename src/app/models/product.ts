import {ProductType} from './product-type.enum';

export interface Product {
  id: number,
  name: string,
  price: number,
  type: ProductType,
  stock: number,
  active: boolean
}
