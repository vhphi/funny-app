import { useRef, useState } from 'react'
import type { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'symbols'>('letters')
  const [uppercase, setUppercase] = useState(false)
  const [shotState, setShotState] = useState<'idle' | 'flying'>('idle')
  const [shotId, setShotId] = useState(0)
  const [arrowPath, setArrowPath] = useState({ x: 0, y: 0, path: 'path("M 0 0 L 0 0")' })
  const [archerReady, setArcherReady] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const passwordStageRef = useRef<HTMLDivElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const archerRef = useRef<HTMLSpanElement>(null)
  const pullStartYRef = useRef<number | null>(null)
  const pullDistanceRef = useRef(0)
  const characters = keyboardMode === 'letters'
    ? 'abcdefghijklmnopqrstuvwxyz'.split('').map((character) => uppercase ? character.toUpperCase() : character)
    : '0123456789!@#$%&*?-_+'.split('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password === 'funny') {
      setLoggedIn(true)
      setMessage('Chúc mừng bạn đã đăng nhập thành công!')
    } else {
      setMessage('Mũi tên đi lạc rồi! Thử lại mật khẩu nhé.')
    }
  }

  function shootCharacter() {
    if (!selectedCharacter || shotState !== 'idle') return
    const stage = passwordStageRef.current?.getBoundingClientRect()
    const input = passwordInputRef.current?.getBoundingClientRect()
    const archer = archerRef.current?.getBoundingClientRect()
    if (!stage || !input || !archer) return

    const startX = archer.left + archer.width / 2 - stage.left
    const startY = archer.top + archer.height / 2 - stage.top
    const endX = input.left + input.width / 2 - stage.left
    const endY = input.top + input.height / 2 - stage.top
    const flightX = endX - startX
    const flightY = endY - startY
    const controlX = flightX / 2
    const controlY = flightY / 2 - 70
    setArrowPath({
      x: startX,
      y: startY,
      path: `path("M 0 0 Q ${controlX} ${controlY} ${flightX} ${flightY}")`,
    })
    setShotId((current) => current + 1)
    setShotState('flying')
    setMessage('')
  }

  function startBowPull(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!selectedCharacter || shotState !== 'idle') return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    pullStartYRef.current = event.clientY
    pullDistanceRef.current = 0
    setPullDistance(0)
    setIsPulling(true)
  }

  function continueBowPull(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!isPulling || pullStartYRef.current === null) return
    const distance = Math.max(0, Math.min(54, event.clientY - pullStartYRef.current))
    pullDistanceRef.current = distance
    setPullDistance(distance)
  }

  function releaseBow() {
    if (!isPulling) return
    const pulledDistance = pullDistanceRef.current
    pullStartYRef.current = null
    pullDistanceRef.current = 0
    setIsPulling(false)
    setPullDistance(0)
    if (pulledDistance >= 14) shootCharacter()
  }

  function cancelBowPull() {
    pullStartYRef.current = null
    pullDistanceRef.current = 0
    setIsPulling(false)
    setPullDistance(0)
  }

  function onArrowLanded() {
    if (!selectedCharacter) return
    setPassword((current) => current + selectedCharacter)
    setSelectedCharacter(null)
    setShotState('idle')
  }

  return (
    <main className="login-page">
      <div className="sunburst" aria-hidden="true" />
      <header className="brand-bar">
        <a className="brand-mark" href="#top" aria-label="Funny App - đầu trang">
          <span className="brand-icon" aria-hidden="true">☺</span>
          FUNNY CLUB
        </a>
        <span className="issue-label">CỔNG VÀO KHU VUI VẺ · SỐ 001</span>
      </header>

      <section className="login-layout" id="top">
        <div className="intro-copy">
          <p className="eyebrow"><span /> CHỈ DÀNH CHO NGƯỜI CÓ KHIẾU HÀI HƯỚC</p>
          <h1>Vào đây<br />cười <span>một tí.</span></h1>
          <p className="intro-text">Cổng này hơi khó tính. Mật khẩu phải được bắn trúng đích mới cho qua.</p>
          <div className="target-stamp" aria-hidden="true">
            <span>100%</span>
            <strong>VUI VẺ</strong>
            <span>KHÔNG HỨA</span>
          </div>
        </div>

        <section className="login-panel" aria-labelledby="login-heading">
          <div className="panel-topline">
            <span>ĐIỂM DANH</span>
            <span className="status-dot"><i /> ĐANG MỞ CỬA</span>
          </div>
          {loggedIn ? (
            <div className="success-state" role="status">
              <span className="success-icon" aria-hidden="true">✓</span>
              <h2>{message}</h2>
              <p>Giữ nụ cười đó nhé, bạn đã vào đúng chỗ rồi.</p>
            </div>
          ) : (
            <>
              <h2 id="login-heading">Xin chào, người vui tính.</h2>
              <p className="panel-subtitle">Đăng nhập để mở cửa. Cung thủ đang chờ lệnh.</p>

              <form onSubmit={onSubmit}>
                <label className="field-label" htmlFor="username">TÊN ĐĂNG NHẬP</label>
                <input
                  className="text-input"
                  id="username"
                  autoComplete="username"
                  placeholder="Tên của bạn"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />

                <div className="password-label-row">
                  <label className="field-label" htmlFor="password">MẬT KHẨU</label>
                  <span className="password-hint">Gợi ý: tên của app, viết thường</span>
                </div>
                <div className="password-stage" ref={passwordStageRef}>
                  <input
                    className="text-input password-input"
                    id="password"
                    ref={passwordInputRef}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Chạm để gọi cung thủ..."
                    value={password}
                    readOnly
                    onFocus={() => setArcherReady(true)}
                    aria-describedby="archery-help"
                  />

                  {archerReady && <div className="archery-board" id="archery-help">
                  <div className="board-heading">
                    <span>CHỌN MỤC TIÊU</span>
                    <span className="target-icon" aria-hidden="true">◎</span>
                  </div>
                  <div className="keyboard-options" aria-label="Chế độ bàn phím">
                    <button
                      className={`mode-button${keyboardMode === 'letters' ? ' active' : ''}`}
                      type="button"
                      aria-pressed={keyboardMode === 'letters'}
                      onClick={() => { setKeyboardMode('letters'); setSelectedCharacter(null) }}
                    >
                      ABC
                    </button>
                    <button
                      className={`mode-button shift-button${uppercase ? ' active' : ''}`}
                      type="button"
                      aria-label="Bật hoặc tắt chữ in hoa"
                      aria-pressed={uppercase}
                      disabled={keyboardMode !== 'letters'}
                      onClick={() => { setUppercase((current) => !current); setSelectedCharacter(null) }}
                    >
                      ⇧ <span>Shift</span>
                    </button>
                    <button
                      className={`mode-button${keyboardMode === 'symbols' ? ' active' : ''}`}
                      type="button"
                      aria-pressed={keyboardMode === 'symbols'}
                      onClick={() => { setKeyboardMode('symbols'); setSelectedCharacter(null) }}
                    >
                      !@#
                    </button>
                  </div>
                  <div className="letter-grid" aria-label={keyboardMode === 'letters' ? 'Chọn chữ cái mật khẩu' : 'Chọn số hoặc ký tự đặc biệt'}>
                    {characters.map((character) => (
                      <button
                        className={`letter-button${selectedCharacter === character ? ' selected' : ''}`}
                        type="button"
                        key={character}
                        disabled={shotState !== 'idle'}
                        aria-pressed={selectedCharacter === character}
                        onClick={() => {
                          setArcherReady(true)
                          setSelectedCharacter(character)
                          setMessage('')
                        }}
                      >
                        {character}
                      </button>
                    ))}
                  </div>
                  <div className="archery-controls">
                    <button
                      className={`archer-control${isPulling ? ' is-pulling' : ''}${shotState === 'flying' ? ' firing' : ''}`}
                      type="button"
                      aria-label={selectedCharacter ? 'Giữ cung, kéo xuống dưới rồi thả để bắn' : 'Chọn ký tự trước khi kéo cung'}
                      aria-pressed={isPulling}
                      disabled={!selectedCharacter || shotState !== 'idle'}
                      onPointerDown={startBowPull}
                      onPointerMove={continueBowPull}
                      onPointerUp={releaseBow}
                      onPointerCancel={cancelBowPull}
                      onClick={(event) => { if (event.detail === 0) shootCharacter() }}
                      style={{ '--pull-distance': `${pullDistance}px`, '--pull-offset': `${pullDistance}px` } as CSSProperties}
                    >
                      <span className="bow-string" aria-hidden="true" />
                      <span ref={archerRef} className="archer" aria-hidden="true">🏹</span>
                    </button>
                    <span className="selected-note">
                      {isPulling ? 'Kéo dây cung xuống...' : shotState === 'flying' ? 'Tên bay tới đích...' : selectedCharacter ? 'Giữ cung, kéo xuống rồi thả' : 'Chọn ký tự để ngắm'}
                    </span>
                  </div>
                  <div className="password-tools">
                    <span>Mỗi phát bắn trúng một ký tự!</span>
                    <button type="button" onClick={() => { setPassword((current) => current.slice(0, -1)); setMessage('') }}>
                      Xóa ký tự cuối
                    </button>
                    <button type="button" onClick={() => { setPassword(''); setMessage('') }}>
                      Làm lại
                    </button>
                  </div>
                  </div>}
                  {shotState === 'flying' && (
                    <span
                      key={shotId}
                      className="arrow-projectile"
                      aria-hidden="true"
                      onAnimationEnd={onArrowLanded}
                      style={{
                        left: arrowPath.x - 12,
                        top: arrowPath.y - 12,
                        '--flight-path': arrowPath.path,
                      } as CSSProperties}
                    >
                      ➶
                    </span>
                  )}
                </div>

                {message && <p className="form-message" role="alert">{message}</p>}
                <button className="submit-button" type="submit" disabled={shotState !== 'idle'}>MỞ CỬA <span aria-hidden="true">→</span></button>
              </form>
              <p className="demo-note">Đăng nhập thử nghiệm · mật khẩu: <strong>funny</strong></p>
            </>
          )}
          <div className="panel-footer"><span>FUNNY CLUB</span><span>© 2026 · CƯỜI LÀ CHÍNH</span></div>
        </section>
      </section>

      <footer className="page-footer">
        <span>HÔM NAY BẠN ĐÃ CƯỜI CHƯA?</span>
        <span>ĐANG NÂNG CẤP KỸ NĂNG BẮN CUNG <b>●</b></span>
      </footer>
    </main>
  )
}

export default App
