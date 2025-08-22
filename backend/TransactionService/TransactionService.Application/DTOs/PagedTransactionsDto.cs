namespace TransactionService.Application.DTOs;

public record PagedTransactionsDto(
    List<TransactionDto> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages,
    bool HasNextPage,
    bool HasPreviousPage
);