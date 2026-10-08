using FunnyApp.Domain.Entities;

namespace FunnyApp.Application.Interfaces;

public interface IJokeRepository
{
    Task<IReadOnlyList<Joke>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Joke?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Joke joke, CancellationToken cancellationToken = default);
    Task DeleteAsync(Joke joke, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
