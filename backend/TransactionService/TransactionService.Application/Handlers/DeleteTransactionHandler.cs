using MediatR;
using TransactionService.Application.Commands;
using TransactionService.Application.Common;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class DeleteTransactionHandler : IRequestHandler<DeleteTransactionCommand, Result>
{
    private readonly ITransactionRepository _repository;

    public DeleteTransactionHandler(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var exists = await _repository.ExistsAsync(request.Id, cancellationToken);
        if (!exists)
        {
            return Result.Failure("Transaction not found");
        }

        var deleted = await _repository.DeleteAsync(request.Id, cancellationToken);
        if (!deleted)
        {
            return Result.Failure("Failed to delete transaction");
        }

        return Result.Success();
    }
}