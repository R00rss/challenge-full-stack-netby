using Grpc.Net.Client;
using InventoryService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddGrpcClient<ProductServiceGRPC.ProductServiceGRPCClient>(options =>
{
    var address = new Uri(builder.Configuration.GetConnectionString("ProductService") ?? "http://localhost:5000");
    Console.WriteLine($"Connecting to ProductService at {address}");
    options.Address = address;
});

builder.Services.AddGrpcClient<TransactionServiceGRPC.TransactionServiceGRPCClient>(options =>
{
    var address = new Uri(builder.Configuration.GetConnectionString("TransactionService") ?? "http://localhost:5001");
    Console.WriteLine($"Connecting to TransactionService at {address}");
    options.Address = address;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");
app.Run();