namespace TransactionService.Application.DTOs;

public record CreateTransactionDto(
    Guid Id,
    DateTime DateTransaction,
    string TransactionType,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice,
    string Detail
);