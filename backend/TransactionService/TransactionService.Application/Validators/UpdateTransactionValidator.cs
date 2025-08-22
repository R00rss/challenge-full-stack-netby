using FluentValidation;
using TransactionService.Application.Commands;
using TransactionService.Domain.Entities;

namespace TransactionService.Application.Validators;

public class UpdateTransactionValidator : AbstractValidator<UpdateTransactionCommand>
{
    public UpdateTransactionValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required")
            .NotEqual(Guid.Empty).WithMessage("Id must be a valid GUID");
        RuleFor(x => x.TransactionDate)
            .NotEmpty().WithMessage("TransactionDate is required")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("TransactionDate cannot be in the future");
        RuleFor(x => x.TransactionType).NotEmpty().WithMessage("TypeTransaction is required")
            .Must(x => Enum.IsDefined(typeof(TransactionType), x))
            .WithMessage("TypeTransaction must be a valid transaction type");

        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("ProductId is required").NotEqual(Guid.Empty)
            .WithMessage("ProductId must be a valid GUID");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");

        RuleFor(x => x.UnitPrice)
            .GreaterThan(0).WithMessage("UnitPrice must be greater than 0")
            .PrecisionScale(10, 2, false).WithMessage("UnitPrice must have maximum 2 decimal places");

        RuleFor(x => x.TotalPrice)
            .GreaterThan(0).WithMessage("TotalPrice must be greater than 0")
            .PrecisionScale(10, 2, false).WithMessage("TotalPrice must have maximum 2 decimal places");
    }

    private static bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var result)
               && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}