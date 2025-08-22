using TransactionService.Application;
using TransactionService.Infrastructure;
using TransactionService.API.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();

builder.Services.AddHealthChecks();

builder.Services.AddLogging();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

var app = builder.Build();

app.MapGrpcService<TransactionGrpcService>();
app.MapGrpcReflectionService();
app.MapHealthChecks("/health");
app.Run();