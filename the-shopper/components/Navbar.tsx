import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id ?? '')
    .single()

  const isAdmin = profile?.role === 'admin'
  const displayName = profile?.full_name || user?.email || ''

  return (
    <header className="border-b border-brand-border bg-brand-surface">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href={isAdmin ? '/admin' : '/dashboard'}
          className="font-display tracking-brand text-sm text-brand-gold uppercase hover:text-brand-gold-hover transition-colors"
        >
          The Shopper
        </Link>

        {/* Links + user */}
        <div className="flex items-center gap-6">
          {isAdmin ? (
            <>
              <Link
                href="/admin"
                className="text-xs text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors"
              >
                Queue
              </Link>
              <span className="text-xs text-brand-border-strong select-none">·</span>
              <span className="text-xs text-amber-600 uppercase tracking-widest font-medium">
                Admin
              </span>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-xs text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/requests/new"
                className="text-xs text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors"
              >
                New Request
              </Link>
            </>
          )}

          <span className="h-4 w-px bg-brand-border" aria-hidden />

          <span className="text-xs text-brand-muted truncate max-w-[160px]">{displayName}</span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}
