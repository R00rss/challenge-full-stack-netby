using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;

namespace ProductService.Application.Commands;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Description,
    string Category,
    string Image,
    decimal Price,
    int Stock
) : IRequest<Result<ProductDto>>;