using FunnyApp.Application.DTOs;
using FunnyApp.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FunnyApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JokesController(IJokeService jokeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<JokeDto>>> GetAll(CancellationToken cancellationToken)
    {
        var jokes = await jokeService.GetAllAsync(cancellationToken);
        return Ok(jokes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JokeDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var joke = await jokeService.GetByIdAsync(id, cancellationToken);
        return joke is null ? NotFound() : Ok(joke);
    }

    [HttpPost]
    public async Task<ActionResult<JokeDto>> Create(
        [FromBody] CreateJokeRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var created = await jokeService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await jokeService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
