using Grpc.Net.Client;
using InventoryService.DTOs;
using InventoryService.DTOs.Transaction;
using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Controllers;

[ApiController]
[Route("api/")]
public class InventoryTransactionServiceController : ControllerBase
{
    private readonly TransactionServiceGRPC.TransactionServiceGRPCClient _transactionClient;
    private readonly ProductServiceGRPC.ProductServiceGRPCClient _productClient;
    private readonly ILogger<InventoryTransactionServiceController> _logger;

    public InventoryTransactionServiceController(
        TransactionServiceGRPC.TransactionServiceGRPCClient transactionClient,
        ProductServiceGRPC.ProductServiceGRPCClient productClient,
        ILogger<InventoryTransactionServiceController> logger
    )
    {
        _transactionClient = transactionClient;
        _productClient = productClient;
        _logger = logger;
    }

    [HttpGet("transaction/isValidStock")]
    public async Task<IActionResult> GetAllQuantityByProductId(
        [FromQuery] string productId,
        [FromQuery] string transactionType,
        [FromQuery] int stock
    )
    {
        try
        {
            var requestTransaction = new GetAllQuantityByProductIdRequest()
            {
                ProductId = productId,
            };

            var responseTransaction = await _transactionClient.GetAllQuantityByProductIdAsync(requestTransaction);
            
            var allStockUsed = responseTransaction.Quantity;
            
            
            var requestProduct = new GetProductByIdRequest { Id = productId };
            var responseProduct = await _productClient.GetProductByIdAsync(requestProduct);
            
            if (!responseProduct.Success)
            {
                return BadRequest(new
                    {
                        responseProduct.ErrorMessage,
                        responseProduct.Success
                    }
                );
            }
            
            var currentStock = responseProduct.Product.Stock;

            var isValidStock = true;

            if (transactionType == "Sale")
            {
                var rest = currentStock - allStockUsed - stock;
                isValidStock = rest < 0;
            }
            
            return Ok(isValidStock);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transactions with sort and search");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }


    [HttpGet("transaction/search")]
    public async Task<IActionResult> GetTransactionsWithSortAndSearch(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortColumn = null,
        [FromQuery] string? sortDirection = "asc",
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var request = new GetTransactionsWithSortAndSearchRequest
            {
                Page = page,
                PageSize = pageSize,
                SortColumn = sortColumn ?? string.Empty,
                SortDirection = sortDirection ?? "asc",
                SearchTerm = searchTerm ?? string.Empty
            };

            var response = await _transactionClient.GetTransactionsWithSortAndSearchAsync(request);

            if (!response.Success)
            {
                return BadRequest(new { error = response.ErrorMessage });
            }

            return Ok(
                new PaginatedResult<Transaction>
                {
                    Items = response.Transactions,
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
            _logger.LogError(ex, "Error getting transactions with sort and search");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }


    [HttpGet("transaction/{id}")]
    public async Task<IActionResult> GetTransaction(string id)
    {
        try
        {
            var request = new GetTransactionByIdRequest { Id = id };
            var response = await _transactionClient.GetTransactionByIdAsync(request);

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
                    Data = response.Transaction
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transaction {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }


    [HttpPost("transaction")]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
    {
        try
        {
            var request = new CreateTransactionRequest
            {
                Detail = dto.Detail,
                Quantity = dto.Quantity,
                TransactionDate = dto.TransactionDate,
                ProductId = dto.ProductId,
                TransactionType = dto.TransactionType,
                TotalPrice = dto.TotalPrice,
                UnitPrice = dto.UnitPrice
            };

            var response = await _transactionClient.CreateTransactionAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Transaction>
                {
                    Data = null,
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Transaction>
            {
                Data = response.Transaction,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating transaction");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPut("transaction/{id}")]
    public async Task<IActionResult> UpdateTransaction(string id, [FromBody] UpdateTransactionDto dto)
    {
        try
        {
            var request = new UpdateTransactionRequest
            {
                Id = id,
                Detail = dto.Detail,
                Quantity = dto.Quantity,
                TransactionDate = dto.TransactionDate,
                ProductId = dto.ProductId,
                TransactionType = dto.TransactionType,
                TotalPrice = dto.TotalPrice,
                UnitPrice = dto.UnitPrice
            };

            var response = await _transactionClient.UpdateTransactionAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Transaction>
                {
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Transaction>
            {
                Data = response.Transaction,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating transaction {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpDelete("transaction/{id}")]
    public async Task<IActionResult> DeleteTransaction(string id)
    {
        try
        {
            var request = new DeleteTransactionRequest { Id = id };
            var response = await _transactionClient.DeleteTransactionAsync(request);

            if (!response.Success)
            {
                return BadRequest(new Result<Transaction>
                {
                    ErrorMessage = response.ErrorMessage,
                    Success = response.Success
                });
            }

            return Ok(new Result<Transaction>
            {
                Data = null,
                ErrorMessage = string.Empty,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting transaction {ProductId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}