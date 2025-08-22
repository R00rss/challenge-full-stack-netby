using MediatR;
using ProductService.Application.Commands;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Application.Queries;
using ProductService.Domain.Contracts;

namespace ProductService.Application.Handlers;

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductByIdHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
        {
            return Result<ProductDto>.Failure("Product not found");
        }

        var productDto = new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Category,
            product.Image,
            product.Price,
            product.Stock
        );

        return Result<ProductDto>.Success(productDto);
    }
}