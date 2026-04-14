'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'forgot'

const inputCls =
  'w-full bg-brand-bg border border-brand-border text-brand-text font-sans px-4 py-3 text-sm ' +
  'placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors min-h-[44px]'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const reset = (next: Mode) => {
    setMode(next)
    setError('')
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        })
        if (error) throw error
        setMessage('Check your inbox — we sent a password reset link.')
        return
      }

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        if (!fullName.trim()) throw new Error('Please enter your full name.')
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email to confirm your account.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const heading =
    mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'

  const submitLabel =
    loading
      ? 'Please wait…'
      : mode === 'signin'
        ? 'Sign In'
        : mode === 'signup'
          ? 'Create Account'
          : 'Send Reset Link'

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

        {/* Card */}
        <div className="bg-brand-surface border border-brand-border p-8">
          <h2 className="font-display text-3xl text-brand-text uppercase mb-6">{heading}</h2>

          {mode === 'forgot' && !message && (
            <p className="mb-5 font-sans text-xs text-brand-muted leading-relaxed">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          )}

          {message && (
            <div className="mb-5 p-3 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 font-sans text-xs">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-950/50 border border-red-900/50 text-red-400 font-sans text-xs">
              {error}
            </div>
          )}

          {/* Hide form after forgot success */}
          {!(mode === 'forgot' && message) && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label className="block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={inputCls}
                    placeholder="••••••••"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => reset('forgot')}
                      className="mt-2 font-mono text-[10px] text-brand-muted hover:text-brand-gold transition-colors uppercase tracking-widest"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.2em] uppercase py-3 min-h-[44px] mt-2 hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
              >
                {submitLabel}
              </button>
            </form>
          )}

          <div className="mt-6 text-center font-sans text-xs text-brand-muted space-y-2">
            {mode === 'forgot' ? (
              <p>
                <button
                  type="button"
                  onClick={() => reset('signin')}
                  className="text-brand-gold hover:text-brand-gold-hover transition-colors underline underline-offset-2"
                >
                  Back to sign in
                </button>
              </p>
            ) : (
              <p>
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => reset(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-brand-gold hover:text-brand-gold-hover transition-colors underline underline-offset-2"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
