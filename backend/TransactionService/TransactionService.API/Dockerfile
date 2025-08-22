FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["TransactionService/TransactionService.API/TransactionService.API.csproj", "TransactionService/TransactionService.API/"]
COPY ["TransactionService/TransactionService.Application/TransactionService.Application.csproj", "TransactionService/TransactionService.Application/"]
COPY ["TransactionService/TransactionService.Domain/TransactionService.Domain.csproj", "TransactionService/TransactionService.Domain/"]
COPY ["TransactionService/TransactionService.Infrastructure/TransactionService.Infrastructure.csproj", "TransactionService/TransactionService.Infrastructure/"]
RUN dotnet restore "TransactionService/TransactionService.API/TransactionService.API.csproj"
COPY . .
WORKDIR "/src/TransactionService/TransactionService.API"
RUN dotnet build "TransactionService.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "TransactionService.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TransactionService.API.dll"]