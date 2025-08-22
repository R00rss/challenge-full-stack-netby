using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ProductService.Domain.Common;
using ProductService.Domain.Contracts;
using ProductService.Domain.Entities;
using ProductService.Infrastructure.Data;

namespace ProductService.Infrastructure.Implementations;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Products.FindAsync([id], cancellationToken);
    }

    public async Task<PagedResult<Product>> GetPagedAsync(int page, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var totalCount = await _context.Products.CountAsync(cancellationToken);

        var items = await _context.Products
            .OrderByDescending(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }


    public async Task<PagedResult<Product>> GetPagedWithSortAndSearchAsync(int page, int pageSize, string? sortColumn,
        SortDirection sortDirection,
        string? searchTerm, CancellationToken cancellationToken = default)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(lowerSearchTerm) ||
                p.Description.ToLower().Contains(lowerSearchTerm) ||
                p.Category.ToLower().Contains(lowerSearchTerm) ||
                p.Price.ToString().Contains(lowerSearchTerm) ||
                p.Stock.ToString().Contains(lowerSearchTerm));
        }

        if (!string.IsNullOrWhiteSpace(sortColumn))
        {
            var parameter = Expression.Parameter(typeof(Product), "p");
            var property = Expression.Property(parameter, sortColumn);
            var lambda = Expression.Lambda(property, parameter);

            var methodName = sortDirection == SortDirection.Asc ? "OrderBy" : "OrderByDescending";
            var resultExpression = Expression.Call(
                typeof(Queryable),
                methodName,
                new Type[] { typeof(Product), property.Type },
                query.Expression,
                Expression.Quote(lambda));

            query = query.Provider.CreateQuery<Product>(resultExpression);
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

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Product> AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<Product> UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _context.Products.FindAsync([id], cancellationToken);
        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        var result = await _context.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Products.AnyAsync(p => p.Id == id, cancellationToken);
    }
}