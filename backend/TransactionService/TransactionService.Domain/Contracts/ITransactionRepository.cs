using TransactionService.Domain.Common;
using TransactionService.Domain.Entities;

namespace TransactionService.Domain.Contracts;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<Transaction>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<PagedResult<Transaction>> GetPagedWithSortAndSearchAsync(
        int page,
        int pageSize,
        string? sortColumn,
        SortDirection sortDirection,
        string? searchTerm,
        CancellationToken cancellationToken = default);

    Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task<Transaction> UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<int> GetAllQuantityByProductId(Guid productId, CancellationToken cancellationToken = default);
}