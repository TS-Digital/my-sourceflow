'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inputCls =
  'w-full bg-brand-bg border border-brand-border text-brand-text font-sans px-4 py-3 text-sm ' +
  'placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors min-h-[44px]'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user lands here via the reset link.
    // The callback route at /auth/callback already exchanged the code for a session,
    // so we just need to confirm the user is authenticated before showing the form.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })

    // Also check for an existing session (covers the case where the callback already
    // set the session before this component mounted).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('Password updated. Redirecting…')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px]">

        {/* Brand mark */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.3em] mb-4">
            Luxury Personal Shopping
          </p>
          <h1 className="font-display text-5xl text-brand-gold uppercase tracking-wide mb-4">
            The Shopper
          </h1>
          <div className="h-px bg-brand-border w-16 mx-auto" />
        </div>

        <div className="bg-brand-surface border border-brand-border p-8">
          <h2 className="font-display text-3xl text-brand-text uppercase mb-6">New Password</h2>

          {!ready && !message && (
            <p className="font-sans text-xs text-brand-muted">Verifying reset link…</p>
          )}

          {message && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 font-sans text-xs">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-950/50 border border-red-900/50 text-red-400 font-sans text-xs">
              {error}
            </div>
          )}

          {ready && !message && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputCls}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className={inputCls}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.2em] uppercase py-3 min-h-[44px] mt-2 hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Set New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
