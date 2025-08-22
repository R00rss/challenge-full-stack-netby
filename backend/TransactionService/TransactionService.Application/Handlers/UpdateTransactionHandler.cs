using MediatR;
using TransactionService.Application.Commands;
using TransactionService.Application.Common;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand, Result<TransactionDto>>
{
    private readonly ITransactionRepository _repository;

    public UpdateTransactionHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<TransactionDto>> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var existingTransaction = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (existingTransaction == null)
        {
            return Result<TransactionDto>.Failure("Transaction not found");
        }

        existingTransaction.ProductId = request.ProductId;
        existingTransaction.Quantity = request.Quantity;
        existingTransaction.UnitPrice = request.UnitPrice;
        existingTransaction.TotalPrice = request.TotalPrice;
        existingTransaction.TransactionDate = request.TransactionDate;
        existingTransaction.Detail = request.Detail;
        existingTransaction.TransactionType = request.TransactionType;

        var updatedTransaction = await _repository.UpdateAsync(existingTransaction, cancellationToken);

        var transactionDto = new TransactionDto(
            updatedTransaction.Id,
            updatedTransaction.TransactionDate,
            updatedTransaction.TransactionType,
            updatedTransaction.ProductId,
            updatedTransaction.Quantity,
            updatedTransaction.UnitPrice,
            updatedTransaction.TotalPrice,
            updatedTransaction.Detail
        );

        return Result<TransactionDto>.Success(transactionDto);
    }
}