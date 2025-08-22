using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProductService.Domain.Contracts;
using ProductService.Infrastructure.Data;
using ProductService.Infrastructure.Implementations;

namespace ProductService.Infrastructure;

public static class InfrastructureRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ConnectionString"))
        );

        services.AddScoped<IProductRepository, ProductRepository>();
        return services;
    }
}