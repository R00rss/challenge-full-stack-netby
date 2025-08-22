using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;

namespace TransactionService.Application.Queries;

public record GetTransactionByIdQuery(Guid Id) : IRequest<Result<TransactionDto>>;