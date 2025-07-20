
export interface OrderItem {
  itemId: number | null;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  comment: string;
  total: number;
  isDeleted: boolean;
  isUpdated: boolean;
}
