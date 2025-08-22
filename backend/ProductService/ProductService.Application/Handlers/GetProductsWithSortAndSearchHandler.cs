using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Application.Queries;
using ProductService.Domain.Contracts;

namespace ProductService.Application.Handlers;

public class
    GetProductsWithSortAndSearchHandler : IRequestHandler<GetProductsWithSortAndSearchQuery, Result<PagedProductsDto>>
{
    private readonly IProductRepository _repository;

    private readonly HashSet<string> _allowedSortColumns = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(Domain.Entities.Product.Name),
        nameof(Domain.Entities.Product.Price),
        nameof(Domain.Entities.Product.Stock),
        nameof(Domain.Entities.Product.Category),
    };

    public GetProductsWithSortAndSearchHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PagedProductsDto>> Handle(GetProductsWithSortAndSearchQuery request,
        CancellationToken cancellationToken)
    {
        // Validate sort column
        if (!string.IsNullOrEmpty(request.SortColumn) && !_allowedSortColumns.Contains(request.SortColumn))
        {
            return Result<PagedProductsDto>.Failure(
                $"Invalid sort column. Allowed columns: {string.Join(", ", _allowedSortColumns)}");
        }

        var pagedResult = await _repository.GetPagedWithSortAndSearchAsync(
            request.Page,
            request.PageSize,
            request.SortColumn,
            request.SortDirection,
            request.SearchTerm,
            cancellationToken);

        var productDtos = pagedResult.Items.Select(p => new ProductDto(
            p.Id,
            p.Name,
            p.Description,
            p.Category,
            p.Image,
            p.Price,
            p.Stock
        )).ToList();

        var pagedProductsDto = new PagedProductsDto(
            productDtos,
            pagedResult.TotalCount,
            pagedResult.Page,
            pagedResult.PageSize,
            pagedResult.TotalPages,
            pagedResult.HasNextPage,
            pagedResult.HasPreviousPage
        );

        return Result<PagedProductsDto>.Success(pagedProductsDto);
    }
}