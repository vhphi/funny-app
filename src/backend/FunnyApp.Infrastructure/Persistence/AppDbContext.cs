using FunnyApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FunnyApp.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Joke> Jokes => Set<Joke>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Joke>(entity =>
        {
            entity.ToTable("Jokes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Setup).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Punchline).HasMaxLength(500).IsRequired();
            entity.Property(e => e.CreatedAtUtc).IsRequired();
        });
    }
}
