namespace FunnyApp.Domain.Entities;

public class Joke
{
    public Guid Id { get; set; }
    public string Setup { get; set; } = string.Empty;
    public string Punchline { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}
