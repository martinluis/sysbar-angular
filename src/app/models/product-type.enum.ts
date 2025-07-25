
export enum ProductType {
  FOOD = 'FOOD',
  DRINK = 'DRINK'
}

export const ProductTypeLabels: Record<ProductType, string> = {
  [ProductType.DRINK]: 'Bebida',
  [ProductType.FOOD]: 'Comida',
};
