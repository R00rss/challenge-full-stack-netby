using MediatR;
using TransactionService.Application.Commands;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Contracts;
using TransactionService.Domain.Entities;

namespace TransactionService.Application.Handlers;

public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, Result<TransactionDto>>
{
    private readonly ITransactionRepository _repository;

    public CreateTransactionHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<TransactionDto>> Handle(CreateTransactionCommand request,
        CancellationToken cancellationToken)
    {
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Detail = request.Detail,
            ProductId = request.ProductId,
            TotalPrice = request.TotalPrice,
            Quantity = request.Quantity,
            TransactionDate = request.TransactionDate,
            TransactionType = request.TransactionType,
            UnitPrice = request.UnitPrice
        };

        var createdTransaction = await _repository.AddAsync(transaction, cancellationToken);

        var transactionDto = new TransactionDto(
            createdTransaction.Id,
            createdTransaction.TransactionDate,
            createdTransaction.TransactionType,
            createdTransaction.ProductId,
            createdTransaction.Quantity,
            createdTransaction.UnitPrice,
            createdTransaction.TotalPrice,
            createdTransaction.Detail
        );

        return Result<TransactionDto>.Success(transactionDto);
    }
}