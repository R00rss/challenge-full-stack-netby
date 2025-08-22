using Grpc.Net.Client;
using InventoryService.DTOs;
using InventoryService.DTOs.Product;
using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Controllers;

[ApiController]
[Route("api/")]
public class InventoryProductServiceController : ControllerBase
{
    private readonly ProductServiceGRPC.ProductServiceGRPCClient _productClient;
    private readonly ILogger<InventoryProductServiceController> _logger;

    public InventoryProductServiceController(
        ProductServiceGRPC.ProductServiceGRPCClient productClient,
        ILogger<InventoryProductServiceController> logger
    )
    {
        _productClient = productClient;
        _logger = logger;
    }

    [HttpGet("product/search")]
    public async Task<IActionResult> GetProductsWithSortAndSearch(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortColumn = null,
        [FromQuery] string? sortDirection = "asc",
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var request = new GetProductsWithSortAndSearchRequest
            {
                Page = page,
                PageSize = pageSize,
                SortColumn = sortColumn ?? string.Empty,
                SortDirection = sortDirection ?? "asc",
                SearchTerm = searchTerm ?? string.Empty
            };

            var response = await _productClient.GetProductsWithSortAndSearchAsync(request);

            if (!response.Success)
            {
                return BadRequest(new { error = response.ErrorMessage });
            }

            return Ok(
                new PaginatedResult<Product>
                {
                    Items = response.Products,
                    Pagination = new Pagination
                    {
                        TotalCount = response.TotalCount,
                        Page = response.Page,
                        PageSize = response.PageSize,
                        TotalPages = response.TotalPages,
                        HasNextPage = response.HasNextPage,
                        HasPreviousPage = response.HasPreviousPage
                    }
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products with sort and search");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }


    [HttpGet("product/{id}")]
    public async Task<IActionResult> GetProduct(string id)
    {
        try
        {
            var request = new GetProductByIdRequest { Id = id };
            var response = await _productClient.GetProductByIdAsync(request);

            if (!response.Success)
            {
                return BadRequest(new
                    {
                        response.ErrorMessage,
                        response.Success
                    }
                );
            }

            return Ok(new
                {
                    response.ErrorMessage,
                    response.Success,
                    Data = response.Product
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }


    [HttpPost("product")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        try
        {
            var request = new CreateProductRequest
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                Image = dto.Image,
                Price = dto.Price,
                Stock = dto.Stock
            };

            var response = await _productClient.CreateProductAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Product>
                {
                    Data = null,
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Product>
            {
                Data = response.Product,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPut("product/{id}")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductDto dto)
    {
        try
        {
            var request = new UpdateProductRequest
            {
                Id = id,
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                Image = dto.Image,
                Price = dto.Price,
                Stock = dto.Stock
            };

            var response = await _productClient.UpdateProductAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Product>
                {
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Product>
            {
                Data = response.Product,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpDelete("product/{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        try
        {
            var request = new DeleteProductRequest { Id = id };
            var response = await _productClient.DeleteProductAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Product>
                {
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Product>
            {
                Data = null,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}

