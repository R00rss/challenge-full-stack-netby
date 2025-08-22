using System.ComponentModel.DataAnnotations;
using Grpc.Core;
using MediatR;
using TransactionService.Domain.Common;
using TransactionService.Application.Commands;
using TransactionService.Application.DTOs;
using TransactionService.Application.Queries;
using TransactionService.Domain.Entities;

namespace TransactionService.API.Services;

public class TransactionGrpcService : TransactionServiceGRPC.TransactionServiceGRPCBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TransactionGrpcService> _logger;

    public TransactionGrpcService(IMediator mediator, ILogger<TransactionGrpcService> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task<GetAllQuantityByProductIdResponse> GetAllQuantityByProductId(
        GetAllQuantityByProductIdRequest request,
        ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.ProductId, out var id))
            {
                return new GetAllQuantityByProductIdResponse
                    { Quantity = 0 };
            }

            var query = new GetAllQuantityByProductIdQuery(id);
            var result = await _mediator.Send(query, context.CancellationToken);

            return new GetAllQuantityByProductIdResponse
            {
                Quantity = result.Value,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transaction by ID: {ProductId}", request.ProductId);
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<TransactionResponse> GetTransactionById(GetTransactionByIdRequest request,
        ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new TransactionResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid transaction ID format"
                };
            }

            var query = new GetTransactionByIdQuery(id);
            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new TransactionResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new TransactionResponse
            {
                Success = true,
                Transaction = MapToGrpcTransaction(result.Value!)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transaction by ID: {ProductId}", request.Id);
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<PagedTransactionsResponse> GetTransactionsPaged(GetTransactionsPagedRequest request,
        ServerCallContext context)
    {
        try
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : Math.Min(request.PageSize, 100); // Max 100 per page

            var query = new GetTransactionsPagedQuery(page, pageSize);
            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new PagedTransactionsResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            var response = new PagedTransactionsResponse
            {
                Success = true,
                TotalCount = result.Value!.TotalCount,
                Page = result.Value.Page,
                PageSize = result.Value.PageSize,
                TotalPages = result.Value.TotalPages,
                HasNextPage = result.Value.HasNextPage,
                HasPreviousPage = result.Value.HasPreviousPage
            };

            response.Transactions.AddRange(result.Value.Items.Select(MapToGrpcTransaction));
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting paged transactions");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<PagedTransactionsResponse> GetTransactionsWithSortAndSearch(
        GetTransactionsWithSortAndSearchRequest request, ServerCallContext context)
    {
        try
        {
            var page = request.Page <= 0 ? 1 : request.Page;
            var pageSize = request.PageSize <= 0 ? 10 : Math.Min(request.PageSize, 100);

            var sortDirection = string.IsNullOrEmpty(request.SortDirection) ||
                                request.SortDirection.ToLower() == "asc"
                ? SortDirection.Asc
                : SortDirection.Desc;

            var query = new GetTransactionsWithSortAndSearchQuery(
                page,
                pageSize,
                request.SortColumn,
                sortDirection,
                request.SearchTerm);

            var result = await _mediator.Send(query, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new PagedTransactionsResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            var response = new PagedTransactionsResponse
            {
                Success = true,
                TotalCount = result.Value!.TotalCount,
                Page = result.Value.Page,
                PageSize = result.Value.PageSize,
                TotalPages = result.Value.TotalPages,
                HasNextPage = result.Value.HasNextPage,
                HasPreviousPage = result.Value.HasPreviousPage
            };

            response.Transactions.AddRange(result.Value.Items.Select(MapToGrpcTransaction));
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transactions with sort and search");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<TransactionResponse> CreateTransaction(CreateTransactionRequest request,
        ServerCallContext context)
    {
        try
        {
            var command = new CreateTransactionCommand(
                DateTime.Parse(request.TransactionDate),
                Enum.Parse<TransactionType>(request.TransactionType),
                Guid.Parse(request.ProductId),
                request.Quantity,
                (decimal)request.UnitPrice,
                (decimal)request.TotalPrice,
                request.Detail
            );

            var result = await _mediator.Send(command, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new TransactionResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new TransactionResponse
            {
                Success = true,
                Transaction = MapToGrpcTransaction(result.Value!)
            };
        }
        catch (ValidationException ex)
        {
            // var errors = string.Join("; ", ex.Errors.Select(e => e.ErrorMessage));
            var errors = ex.Message;
            return new TransactionResponse
            {
                Success = false,
                ErrorMessage = errors
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating transaction");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<TransactionResponse> UpdateTransaction(UpdateTransactionRequest request,
        ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new TransactionResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid transaction ID format"
                };
            }

            var command = new UpdateTransactionCommand(
                Guid.Parse(request.Id),
                DateTime.Parse(request.TransactionDate),
                Enum.Parse<TransactionType>(request.TransactionType),
                Guid.Parse(request.ProductId),
                request.Quantity,
                (decimal)request.UnitPrice,
                (decimal)request.TotalPrice,
                request.Detail
            );

            var result = await _mediator.Send(command, context.CancellationToken);

            if (!result.IsSuccess)
            {
                return new TransactionResponse
                {
                    Success = false,
                    ErrorMessage = result.Error
                };
            }

            return new TransactionResponse
            {
                Success = true,
                Transaction = MapToGrpcTransaction(result.Value!)
            };
        }
        catch (ValidationException ex)
        {
            // var errors = string.Join("; ", ex.Errors.Select(e => e.ErrorMessage));
            var errors = ex.Message;
            return new TransactionResponse
            {
                Success = false,
                ErrorMessage = errors
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating transaction");
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    public override async Task<DeleteTransactionResponse> DeleteTransaction(DeleteTransactionRequest request,
        ServerCallContext context)
    {
        try
        {
            if (!Guid.TryParse(request.Id, out var id))
            {
                return new DeleteTransactionResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid transaction ID format"
                };
            }

            var command = new DeleteTransactionCommand(id);
            var result = await _mediator.Send(command, context.CancellationToken);

            return new DeleteTransactionResponse
            {
                Success = result.IsSuccess,
                ErrorMessage = result.IsSuccess ? string.Empty : result.Error
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting transaction: {ProductId}", request.Id);
            throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
        }
    }

    private static Transaction MapToGrpcTransaction(TransactionDto transactionDto)
    {
        return new Transaction
        {
            Id = transactionDto.Id.ToString(),
            TransactionDate = transactionDto.TransactionDate.ToString("o"),
            TransactionType = Enum.GetName(typeof(TransactionType), transactionDto.TransactionType),
            ProductId = transactionDto.ProductId.ToString(),
            Quantity = transactionDto.Quantity,
            UnitPrice = (double)transactionDto.UnitPrice,
            TotalPrice = (double)transactionDto.TotalPrice,
            Detail = transactionDto.Detail
        };
    }
}