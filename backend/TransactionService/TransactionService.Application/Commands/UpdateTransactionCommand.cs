using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Entities;

namespace TransactionService.Application.Commands;

public record UpdateTransactionCommand(
    Guid Id,
    DateTime TransactionDate,
    TransactionType TransactionType,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice,
    string Detail
) : IRequest<Result<TransactionDto>>;