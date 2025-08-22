using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;

namespace TransactionService.Application.Queries;

public record GetAllQuantityByProductIdQuery(Guid Id): IRequest<Result<int>>;