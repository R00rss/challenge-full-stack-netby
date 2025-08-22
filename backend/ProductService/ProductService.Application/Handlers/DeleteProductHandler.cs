using MediatR;
using ProductService.Application.Commands;
using ProductService.Application.Common;
using ProductService.Domain.Contracts;

namespace ProductService.Application.Handlers;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, Result>
{
    private readonly IProductRepository _repository;

    public DeleteProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var exists = await _repository.ExistsAsync(request.Id, cancellationToken);
        if (!exists)
        {
            return Result.Failure("Product not found");
        }

        var deleted = await _repository.DeleteAsync(request.Id, cancellationToken);
        if (!deleted)
        {
            return Result.Failure("Failed to delete product");
        }

        return Result.Success();
    }
}