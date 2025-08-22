using MediatR;
using ProductService.Application.Common;
using ProductService.Application.DTOs;
using ProductService.Application.Queries;
using ProductService.Domain.Contracts;

namespace ProductService.Application.Handlers;

public class GetProductsPagedHandler : IRequestHandler<GetProductsPagedQuery, Result<PagedProductsDto>>
{
    private readonly IProductRepository _repository;

    public GetProductsPagedHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PagedProductsDto>> Handle(GetProductsPagedQuery request,
        CancellationToken cancellationToken)
    {
        var pagedResult = await _repository.GetPagedAsync(request.Page, request.PageSize, cancellationToken);

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
            pagedResult.HasPreviousPage);

        return Result<PagedProductsDto>.Success(pagedProductsDto);
    }
}