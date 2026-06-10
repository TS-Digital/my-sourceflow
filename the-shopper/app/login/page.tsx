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

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
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

          {/* Google OAuth — only on sign-in / sign-up */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-[#0e0e10] border border-white/10 hover:border-white/20 text-brand-text font-mono text-[11px] uppercase tracking-[0.15em] min-h-[44px] px-4 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-brand-border" />
                <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-brand-border" />
              </div>
            </>
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
