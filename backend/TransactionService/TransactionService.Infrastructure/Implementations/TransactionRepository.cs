using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TransactionService.Domain.Common;
using TransactionService.Domain.Contracts;
using TransactionService.Domain.Entities;
using TransactionService.Infrastructure.Data;

namespace TransactionService.Infrastructure.Implementations;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Transactions.FindAsync([id], cancellationToken);
    }

    public async Task<PagedResult<Transaction>> GetPagedAsync(int page, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var totalCount = await _context.Transactions.CountAsync(cancellationToken);

        var items = await _context.Transactions
            .OrderByDescending(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Transaction>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<Transaction>> GetPagedWithSortAndSearchAsync(int page, int pageSize,
        string? sortColumn,
        SortDirection sortDirection,
        string? searchTerm, CancellationToken cancellationToken = default)

    {
        var query = _context.Transactions.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(t =>
                t.Detail.ToLower().Contains(lowerSearchTerm)
                || t.TransactionType.ToString().ToLower().Contains(lowerSearchTerm)
            );
        }

        if (!string.IsNullOrWhiteSpace(sortColumn))
        {
            var parameter = Expression.Parameter(typeof(Transaction), "t");
            var property = Expression.Property(parameter, sortColumn);
            var lambda = Expression.Lambda(property, parameter);

            var methodName = sortDirection == SortDirection.Asc ? "OrderBy" : "OrderByDescending";
            var resultExpression = Expression.Call(
                typeof(Queryable),
                methodName,
                new Type[] { typeof(Transaction), property.Type },
                query.Expression,
                Expression.Quote(lambda));

            query = query.Provider.CreateQuery<Transaction>(resultExpression);
        }
        else
        {
            query = sortDirection == SortDirection.Asc
                ? query.OrderBy(p => p.Id)
                : query.OrderByDescending(p => p.Id);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Transaction>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }


    public async Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);
        return transaction;
    }

    public async Task<Transaction> UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync(cancellationToken);
        return transaction;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var transaction = await _context.Transactions.FindAsync([id], cancellationToken);
        if (transaction == null)
        {
            return false;
        }

        _context.Transactions.Remove(transaction);
        var result = await _context.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Transactions.AnyAsync(p => p.Id == id, cancellationToken);
    }

    public Task<int> GetAllQuantityByProductId(Guid productId, CancellationToken cancellationToken = default)
    {
        return _context.Transactions
            .Where(t => t.ProductId == productId)
            .SumAsync(t => t.Quantity, cancellationToken);
    }
}