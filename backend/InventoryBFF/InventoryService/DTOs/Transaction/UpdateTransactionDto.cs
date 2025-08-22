namespace InventoryService.DTOs.Transaction;

public class UpdateTransactionDto
{
    public string TransactionDate { get; set; } = string.Empty;
    public string TransactionType { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public double UnitPrice { get; set; }
    public double TotalPrice { get; set; }
    public string Detail { get; set; } = string.Empty;
}