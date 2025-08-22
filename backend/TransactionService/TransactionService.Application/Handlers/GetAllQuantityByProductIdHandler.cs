using MediatR;
using TransactionService.Application.Common;
using TransactionService.Application.Queries;
using TransactionService.Domain.Contracts;

namespace TransactionService.Application.Handlers;

public class GetAllQuantityByProductIdHandler : IRequestHandler<GetAllQuantityByProductIdQuery, Result<int>>
{
    private readonly ITransactionRepository _repository;

    public async Task<Result<int>> Handle(GetAllQuantityByProductIdQuery request, CancellationToken cancellationToken)
    {
        var quantity = await _repository.GetAllQuantityByProductId(request.Id, cancellationToken);
        return Result<int>.Success(quantity);
    }
}