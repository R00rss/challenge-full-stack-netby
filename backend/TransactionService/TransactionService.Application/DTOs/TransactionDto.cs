using TransactionService.Domain.Entities;

namespace TransactionService.Application.DTOs;

public record TransactionDto(
    Guid Id,
    DateTime TransactionDate,
    TransactionType TransactionType,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice,
    string Detail
);