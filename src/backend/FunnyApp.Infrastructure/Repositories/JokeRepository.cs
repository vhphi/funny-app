using FunnyApp.Application.Interfaces;
using FunnyApp.Domain.Entities;
using FunnyApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FunnyApp.Infrastructure.Repositories;

public class JokeRepository(AppDbContext dbContext) : IJokeRepository
{
    public async Task<IReadOnlyList<Joke>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await dbContext.Jokes
            .AsNoTracking()
            .OrderByDescending(j => j.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<Joke?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await dbContext.Jokes.FirstOrDefaultAsync(j => j.Id == id, cancellationToken);

    public async Task AddAsync(Joke joke, CancellationToken cancellationToken = default) =>
        await dbContext.Jokes.AddAsync(joke, cancellationToken);

    public Task DeleteAsync(Joke joke, CancellationToken cancellationToken = default)
    {
        dbContext.Jokes.Remove(joke);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
