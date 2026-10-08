using FunnyApp.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FunnyApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IJokeService, JokeService>();
        return services;
    }
}
