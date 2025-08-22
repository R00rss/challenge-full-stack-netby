using MediatR;
using TransactionService.Application.Common;

namespace TransactionService.Application.Commands;

public record DeleteTransactionCommand(Guid Id) : IRequest<Result>;