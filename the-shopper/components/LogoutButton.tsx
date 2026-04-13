'use client'

import { signOut } from '@/lib/actions'

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs text-brand-muted hover:text-brand-text transition-colors uppercase tracking-widest"
      >
        Sign out
      </button>
    </form>
  )
}
