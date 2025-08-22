using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Common;

namespace TransactionService.Application.Queries;

public record GetTransactionsWithSortAndSearchQuery(
    int Page,
    int PageSize,
    string? SortColumn,
    SortDirection SortDirection,
    string? SearchTerm
) : IRequest<Result<PagedTransactionsDto>>;