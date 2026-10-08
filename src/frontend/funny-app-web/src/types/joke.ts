export interface Joke {
  id: string
  setup: string
  punchline: string
  createdAtUtc: string
}

export interface CreateJokePayload {
  setup: string
  punchline: string
}
