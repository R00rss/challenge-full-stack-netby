namespace InventoryService.DTOs;

public class PaginatedResult<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public Pagination Pagination { get; set; }
}