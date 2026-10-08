import type { CreateJokePayload, Joke } from '../types/joke'

const baseUrl = '/api/jokes'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = typeof body.error === 'string' ? body.error : response.statusText
    throw new Error(message || 'Request failed')
  }
  return response.json() as Promise<T>
}

export async function fetchJokes(): Promise<Joke[]> {
  const response = await fetch(baseUrl)
  return handleResponse<Joke[]>(response)
}

export async function createJoke(payload: CreateJokePayload): Promise<Joke> {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Joke>(response)
}

export async function deleteJoke(id: string): Promise<void> {
  const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
  if (!response.ok && response.status !== 204) {
    throw new Error('Could not delete joke')
  }
}
