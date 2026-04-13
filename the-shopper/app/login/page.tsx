'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup'

const inputCls =
  'w-full bg-[#080808] border border-[#222] text-[#F0EDE6] px-4 py-3 text-sm ' +
  'placeholder:text-[#444] focus:outline-none focus:border-[#C49A3C] transition-colors'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.')
        }
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

  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        {/* Brand mark */}
        <div className="text-center mb-12">
          <h1
            className="font-display text-xl tracking-[0.35em] uppercase mb-3"
            style={{ color: '#C49A3C' }}
          >
            The Shopper
          </h1>
          <div className="h-px bg-[#222] w-24 mx-auto mb-3" />
          <p className="text-[10px] text-[#767676] tracking-[0.25em] uppercase">
            Luxury Personal Shopping
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#101010] border border-[#222] p-8">
          <h2 className="font-display text-xl text-[#F0EDE6] mb-6">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>

          {message && (
            <div className="mb-5 p-3 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 text-xs">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-950/50 border border-red-900/50 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] text-[#767676] uppercase tracking-widest mb-2">
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
              <label className="block text-[10px] text-[#767676] uppercase tracking-widest mb-2">
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

            <div>
              <label className="block text-[10px] text-[#767676] uppercase tracking-widest mb-2">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C49A3C] text-[#080808] text-xs font-semibold tracking-[0.15em] uppercase py-3 mt-2 hover:bg-[#D4AA4C] transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#767676]">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setMessage('')
              }}
              className="text-[#C49A3C] hover:text-[#D4AA4C] transition-colors underline underline-offset-2"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
