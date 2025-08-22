using MediatR;
using ProductService.Application.Commands;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Domain.Contracts;

namespace ProductService.Application.Handlers;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Result<ProductDto>>
{
    private readonly IProductRepository _repository;

    public UpdateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var existingProduct = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (existingProduct == null)
        {
            return Result<ProductDto>.Failure("Product not found");
        }

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Category = request.Category;
        existingProduct.Image = request.Image;
        existingProduct.Price = request.Price;
        existingProduct.Stock = request.Stock;

        var updatedProduct = await _repository.UpdateAsync(existingProduct, cancellationToken);

        var productDto = new ProductDto(
            updatedProduct.Id,
            updatedProduct.Name,
            updatedProduct.Description,
            updatedProduct.Category,
            updatedProduct.Image,
            updatedProduct.Price,
            updatedProduct.Stock
        );

        return Result<ProductDto>.Success(productDto);
    }
}