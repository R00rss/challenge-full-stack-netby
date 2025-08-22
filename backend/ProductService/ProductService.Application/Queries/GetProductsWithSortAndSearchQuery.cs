using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Domain.Common;

namespace ProductService.Application.Queries;

public record GetProductsWithSortAndSearchQuery(
    int Page,
    int PageSize,
    string? SortColumn,
    SortDirection SortDirection,
    string? SearchTerm
) : IRequest<Result<PagedProductsDto>>;