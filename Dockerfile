# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ShippingManagementApp/ShippingManagementApp.csproj", "ShippingManagementApp/"]
RUN dotnet restore "ShippingManagementApp/ShippingManagementApp.csproj"

# Copy the rest of the code
COPY . .
WORKDIR "/src/ShippingManagementApp"

# Build the application
RUN dotnet build "ShippingManagementApp.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "ShippingManagementApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ShippingManagementApp.dll"]
