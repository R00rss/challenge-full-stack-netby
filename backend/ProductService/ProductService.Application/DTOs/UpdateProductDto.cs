namespace ProductService.Application.DTOs;

public record UpdateProductDto(
    Guid Id,
    string Name,
    string Description,
    string Category,
    string Image,
    decimal Price,
    int Stock
);