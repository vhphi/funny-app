using FunnyApp.Application.DTOs;
using FunnyApp.Application.Interfaces;
using FunnyApp.Domain.Entities;

namespace FunnyApp.Application.Services;

public class JokeService(IJokeRepository jokeRepository) : IJokeService
{
    public async Task<IReadOnlyList<JokeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var jokes = await jokeRepository.GetAllAsync(cancellationToken);
        return jokes.Select(MapToDto).ToList();
    }

    public async Task<JokeDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var joke = await jokeRepository.GetByIdAsync(id, cancellationToken);
        return joke is null ? null : MapToDto(joke);
    }

    public async Task<JokeDto> CreateAsync(CreateJokeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Setup))
            throw new ArgumentException("Setup is required.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.Punchline))
            throw new ArgumentException("Punchline is required.", nameof(request));

        var joke = new Joke
        {
            Id = Guid.NewGuid(),
            Setup = request.Setup.Trim(),
            Punchline = request.Punchline.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        await jokeRepository.AddAsync(joke, cancellationToken);
        await jokeRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(joke);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var joke = await jokeRepository.GetByIdAsync(id, cancellationToken);
        if (joke is null)
            return false;

        await jokeRepository.DeleteAsync(joke, cancellationToken);
        await jokeRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static JokeDto MapToDto(Joke joke) =>
        new(joke.Id, joke.Setup, joke.Punchline, joke.CreatedAtUtc);
}
