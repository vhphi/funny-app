namespace FunnyApp.Application.DTOs;

public record JokeDto(Guid Id, string Setup, string Punchline, DateTime CreatedAtUtc);
