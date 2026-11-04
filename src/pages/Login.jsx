import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { ApiError } from '../lib/api'
import './Login.css'

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to="/official" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ username: username.trim(), password })
      const destination = location.state?.from
      navigate(destination?.pathname?.startsWith('/official') ? destination : '/official', { replace: true })
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : (cause?.message || 'Unable to sign in. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="login-back" to="/">← Back to public portal</Link>
        <div className="login-mark" aria-hidden="true">PM</div>
        <p className="login-eyebrow">PM SETU · ANDHRA PRADESH</p>
        <h1 id="login-title">Official sign in</h1>
        <p className="login-intro">For authorised department, institution and programme users.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Username</span>
            <input className="field__input" name="username" autoComplete="username" value={username}
              onChange={(event) => setUsername(event.target.value)} required autoFocus />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input className="field__input" name="password" type="password" autoComplete="current-password"
              value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="btn btn--primary login-submit" type="submit" disabled={submitting || loading}>
            {submitting ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>

        <p className="login-note">
          Accounts are provisioned by authorised PM SETU administrators. Public visitors do not need to sign in.
        </p>
      </section>
    </main>
  )
}

export default Login
