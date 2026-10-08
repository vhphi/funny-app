import { FormEvent, useCallback, useEffect, useState } from 'react'
import { createJoke, deleteJoke, fetchJokes } from './api/jokesApi'
import type { Joke } from './types/joke'
import './App.css'

function App() {
  const [jokes, setJokes] = useState<Joke[]>([])
  const [setup, setSetup] = useState('')
  const [punchline, setPunchline] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadJokes = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchJokes()
      setJokes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jokes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadJokes()
  }, [loadJokes])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createJoke({ setup, punchline })
      setSetup('')
      setPunchline('')
      await loadJokes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create joke')
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(id: string) {
    setError(null)
    try {
      await deleteJoke(id)
      setJokes((prev) => prev.filter((j) => j.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete joke')
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Funny App</h1>
        <p>React UI · .NET 8 API · SQL Server</p>
      </header>

      <section className="card">
        <h2>Thêm joke mới</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Setup
            <input
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              placeholder="Tại sao con gà băng qua đường?"
              required
            />
          </label>
          <label>
            Punchline
            <input
              value={punchline}
              onChange={(e) => setPunchline(e.target.value)}
              placeholder="Để sang bên kia."
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Đang lưu…' : 'Lưu'}
          </button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Danh sách joke</h2>
        {loading ? (
          <p>Đang tải…</p>
        ) : jokes.length === 0 ? (
          <p>Chưa có joke nào. Thêm cái đầu tiên nhé!</p>
        ) : (
          <ul className="joke-list">
            {jokes.map((joke) => (
              <li key={joke.id} className="joke-item">
                <div>
                  <strong>{joke.setup}</strong>
                  <p>{joke.punchline}</p>
                </div>
                <button type="button" className="ghost" onClick={() => void onDelete(joke.id)}>
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
