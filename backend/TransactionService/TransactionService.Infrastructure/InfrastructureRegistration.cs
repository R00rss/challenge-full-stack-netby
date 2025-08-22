using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TransactionService.Domain.Contracts;
using TransactionService.Infrastructure.Data;
using TransactionService.Infrastructure.Implementations;

namespace TransactionService.Infrastructure;

public static class InfrastructureRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ConnectionString"))
        );

        services.AddScoped<ITransactionRepository, TransactionRepository>();
        return services;
    }
}