using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;

namespace ProductService.Application.Queries;

public record GetProductsPagedQuery(int Page, int PageSize) : IRequest<Result<PagedProductsDto>>;