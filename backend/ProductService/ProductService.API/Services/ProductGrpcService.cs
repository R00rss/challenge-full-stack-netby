using System.ComponentModel.DataAnnotations;
using Grpc.Core;
using MediatR;
using ProductService.Application.Commands;
using ProductService.Application.DTOs;
using ProductService.Application.Queries;
using ProductService.Domain.Common;

namespace ProductService.API.Services;

public class ProductGrpcService : ProductServiceGRPC.ProductServiceGRPCBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductGrpcService> _logger;

    public ProductGrpcService(IMediator mediator, ILogger<ProductGrpcService> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task<ProductResponse> GetProductById(GetProductByIdRequest request, ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new ProductResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid product ID format"
                };
            }

            var query = new GetProductByIdQuery(id);
            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new ProductResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new ProductResponse
            {
                Success = true,
                Product = MapToGrpcProduct(result.Value!)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product by ID: {ProductId}", request.Id);
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<PagedProductsResponse> GetProductsPaged(GetProductsPagedRequest request, ServerCallContext context)
    {
        try
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : Math.Min(request.PageSize, 100); // Max 100 per page

            var query = new GetProductsPagedQuery(page, pageSize);
            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new PagedProductsResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            var response = new PagedProductsResponse
            {
                Success = true,
                TotalCount = result.Value!.TotalCount,
                Page = result.Value.Page,
                PageSize = result.Value.PageSize,
                TotalPages = result.Value.TotalPages,
                HasNextPage = result.Value.HasNextPage,
                HasPreviousPage = result.Value.HasPreviousPage
            };

            response.Products.AddRange(result.Value.Items.Select(MapToGrpcProduct));
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting paged products");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<PagedProductsResponse> GetProductsWithSortAndSearch(GetProductsWithSortAndSearchRequest request, ServerCallContext context)
    {
        try
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : Math.Min(request.PageSize, 100);
            
            var sortDirection = string.IsNullOrEmpty(request.SortDirection) || 
                                request.SortDirection.ToLower() == "asc" 
                                ? SortDirection.Asc 
                                : SortDirection.Desc;

            var query = new GetProductsWithSortAndSearchQuery(
                page, 
                pageSize, 
                request.SortColumn, 
                sortDirection, 
                request.SearchTerm);

            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new PagedProductsResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            var response = new PagedProductsResponse
            {
                Success = true,
                TotalCount = result.Value!.TotalCount,
                Page = result.Value.Page,
                PageSize = result.Value.PageSize,
                TotalPages = result.Value.TotalPages,
                HasNextPage = result.Value.HasNextPage,
                HasPreviousPage = result.Value.HasPreviousPage
            };

            response.Products.AddRange(result.Value.Items.Select(MapToGrpcProduct));
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products with sort and search");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<ProductResponse> CreateProduct(CreateProductRequest request, ServerCallContext context)
    {
        try
        {
            var command = new CreateProductCommand(
                request.Name,
                request.Description,
                request.Category,
                request.Image,
                (decimal)request.Price,
                request.Stock);

            var result = await _mediator.Send(command, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new ProductResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new ProductResponse
            {
                Success = true,
                Product = MapToGrpcProduct(result.Value!)
            };
        }
        catch (ValidationException ex)
        {
            // var errors = string.Join("; ", ex.Errors.Select(e => e.ErrorMessage));
            var errors = ex.Message;
            return new ProductResponse
            {
                Success = false,
                ErrorMessage = errors
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<ProductResponse> UpdateProduct(UpdateProductRequest request, ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new ProductResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid product ID format"
                };
            }

            var command = new UpdateProductCommand(
                id,
                request.Name,
                request.Description,
                request.Category,
                request.Image,
                (decimal)request.Price,
                request.Stock);

            var result = await _mediator.Send(command, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new ProductResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new ProductResponse
            {
                Success = true,
                Product = MapToGrpcProduct(result.Value!)
            };
        }
        catch (ValidationException ex)
        {
            // var errors = string.Join("; ", ex.Errors.Select(e => e.ErrorMessage));
            var errors = ex.Message;
            return new ProductResponse
            {
                Success = false,
                ErrorMessage = errors
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<DeleteProductResponse> DeleteProduct(DeleteProductRequest request, ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new DeleteProductResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid product ID format"
                };
            }

            var command = new DeleteProductCommand(id);
            var result = await _mediator.Send(command, context.CancellationToken);

            return new DeleteProductResponse
            {
                Success = result.IsSuccess,
                ErrorMessage = result.IsSuccess ? string.Empty : result.Error
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product: {ProductId}", request.Id);
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    private static Product MapToGrpcProduct(ProductDto productDto)
    {
        return new Product
        {
            Id = productDto.Id.ToString(),
            Name = productDto.Name,
            Description = productDto.Description,
            Category = productDto.Category,
            Image = productDto.Image,
            Price = (double)productDto.Price,
            Stock = productDto.Stock
        };
    }
}