namespace InventoryService.DTOs;

public class Result<T>
{
    public T? Data { get; set; } = default;
    public string ErrorMessage { get; set; } = string.Empty;
    public bool Success { get; set; }
}