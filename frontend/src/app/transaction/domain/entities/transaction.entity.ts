export default interface TransactionEntity {
  id: string;
  transactionDate: string;
  transactionType: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  detail: string;
}
