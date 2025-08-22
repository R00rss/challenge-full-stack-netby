using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;

namespace ProductService.Application.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<Result<ProductDto>>;