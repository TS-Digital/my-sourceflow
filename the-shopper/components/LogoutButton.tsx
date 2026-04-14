'use client'

import { signOut } from '@/lib/actions'

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="font-mono text-[11px] text-brand-muted hover:text-brand-text transition-colors uppercase tracking-widest min-h-[44px] flex items-center"
      >
        Sign Out
      </button>
    </form>
  )
}
