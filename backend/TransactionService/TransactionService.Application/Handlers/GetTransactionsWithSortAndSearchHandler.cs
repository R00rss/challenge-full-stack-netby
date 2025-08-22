using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Application.Queries;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class
    GetTransactionsWithSortAndSearchHandler : IRequestHandler<GetTransactionsWithSortAndSearchQuery,
    Result<PagedTransactionsDto>>
{
    private readonly ITransactionRepository _repository;

    private readonly HashSet<string> _allowedSortColumns = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(Domain.Entities.Transaction.Id),
        nameof(Domain.Entities.Transaction.ProductId),
        nameof(Domain.Entities.Transaction.UnitPrice),
        nameof(Domain.Entities.Transaction.TotalPrice),
        nameof(Domain.Entities.Transaction.Quantity),
        nameof(Domain.Entities.Transaction.TransactionType)
    };

    public GetTransactionsWithSortAndSearchHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PagedTransactionsDto>> Handle(GetTransactionsWithSortAndSearchQuery request,
        CancellationToken cancellationToken)
    {
        // Validate sort column
        if (!string.IsNullOrEmpty(request.SortColumn) && !_allowedSortColumns.Contains(request.SortColumn))
        {
            return Result<PagedTransactionsDto>.Failure(
                $"Invalid sort column. Allowed columns: {string.Join(", ", _allowedSortColumns)}");
        }

        var pagedResult = await _repository.GetPagedWithSortAndSearchAsync(
            request.Page,
            request.PageSize,
            request.SortColumn,
            request.SortDirection,
            request.SearchTerm,
            cancellationToken);

        var transactionDtos = pagedResult.Items.Select(t => new TransactionDto(
            t.Id,
            t.TransactionDate,
            t.TransactionType,
            t.ProductId,
            t.Quantity,
            t.UnitPrice,
            t.TotalPrice,
            t.Detail
        )).ToList();

        var pagedTransactionsDto = new PagedTransactionsDto(
            transactionDtos,
            pagedResult.TotalCount,
            pagedResult.Page,
            pagedResult.PageSize,
            pagedResult.TotalPages,
            pagedResult.HasNextPage,
            pagedResult.HasPreviousPage
        );

        return Result<PagedTransactionsDto>.Success(pagedTransactionsDto);
    }
}