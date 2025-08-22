using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;

namespace TransactionService.Application.Queries;

public record GetTransactionsPagedQuery(int Page, int PageSize) : IRequest<Result<PagedTransactionsDto>>;