using FunnyApp.Application.DTOs;

namespace FunnyApp.Application.Services;

public interface IJokeService
{
    Task<IReadOnlyList<JokeDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<JokeDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<JokeDto> CreateAsync(CreateJokeRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
