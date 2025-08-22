namespace ProductService.Application.DTOs;

public record CreateProductDto(
    string Name,
    string Description,
    string Category,
    string Image,
    decimal Price,
    int Stock
);