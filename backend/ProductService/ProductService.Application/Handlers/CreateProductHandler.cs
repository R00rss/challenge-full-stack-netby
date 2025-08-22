using MediatR;
using ProductService.Application.Commands;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Domain.Contracts;
using ProductService.Domain.Entities;

namespace ProductService.Application.Handlers;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    private readonly IProductRepository _repository;

    public CreateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Image = request.Image,
            Price = request.Price,
            Stock = request.Stock
        };

        var createdProduct = await _repository.AddAsync(product, cancellationToken);

        var productDto = new ProductDto(
            createdProduct.Id,
            createdProduct.Name,
            createdProduct.Description,
            createdProduct.Category,
            createdProduct.Image,
            createdProduct.Price,
            createdProduct.Stock
        );

        return Result<ProductDto>.Success(productDto);
    }
}