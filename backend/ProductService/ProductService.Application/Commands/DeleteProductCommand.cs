using MediatR;
using ProductService.Application.Common;

namespace ProductService.Application.Commands;

public record DeleteProductCommand(Guid Id) : IRequest<Result>;