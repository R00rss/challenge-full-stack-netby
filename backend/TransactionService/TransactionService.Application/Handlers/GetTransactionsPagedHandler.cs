using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Application.Queries;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class GetTransactionsPagedHandler : IRequestHandler<GetTransactionsPagedQuery, Result<PagedTransactionsDto>>
{
    private readonly ITransactionRepository _repository;

    public GetTransactionsPagedHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PagedTransactionsDto>> Handle(GetTransactionsPagedQuery request,
        CancellationToken cancellationToken)
    {
        var pagedResult = await _repository.GetPagedAsync(request.Page, request.PageSize, cancellationToken);

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
            pagedResult.HasPreviousPage);

        return Result<PagedTransactionsDto>.Success(pagedTransactionsDto);
    }
}