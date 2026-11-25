
export enum ProductType {
  FOOD = 'FOOD',
  DRINK = 'DRINK'
}

export const ProductTypeLabels: Record<ProductType, string> = {
  [ProductType.DRINK]: 'PRODUCT_TYPE.DRINK',
  [ProductType.FOOD]: 'PRODUCT_TYPE.FOOD',
};
