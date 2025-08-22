using ProductService.Application;
using ProductService.Infrastructure;
using ProductService.API.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();

builder.Services.AddHealthChecks();

builder.Services.AddLogging();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

var app = builder.Build();

app.MapGrpcService<ProductGrpcService>();
app.MapGrpcReflectionService();
app.MapHealthChecks("/health");
app.Run();