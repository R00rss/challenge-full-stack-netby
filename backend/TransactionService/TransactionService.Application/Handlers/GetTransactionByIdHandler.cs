using MediatR;
using TransactionService.Application.Commands;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Application.Queries;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class GetTransactionByIdHandler : IRequestHandler<GetTransactionByIdQuery, Result<TransactionDto>>
{
    private readonly ITransactionRepository _repository;

    public GetTransactionByIdHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<TransactionDto>> Handle(GetTransactionByIdQuery request,
        CancellationToken cancellationToken)
    {
        var transaction = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (transaction == null)
        {
            return Result<TransactionDto>.Failure("Transaction not found");
        }

        var transactionDto = new TransactionDto(
            transaction.Id,
            transaction.TransactionDate,
            transaction.TransactionType,
            transaction.ProductId,
            transaction.Quantity,
            transaction.UnitPrice,
            transaction.TotalPrice,
            transaction.Detail
        );

        return Result<TransactionDto>.Success(transactionDto);
    }
}