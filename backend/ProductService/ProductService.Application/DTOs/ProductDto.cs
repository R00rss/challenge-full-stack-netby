namespace ProductService.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string Description,
    string Category,
    string Image,
    decimal Price,
    int Stock
);