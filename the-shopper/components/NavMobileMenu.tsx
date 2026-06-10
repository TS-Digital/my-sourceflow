'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

interface NavLink {
  href: string
  label: string
}

interface Props {
  links: NavLink[]
  publicLinks: NavLink[]
  displayName: string
  isAdmin: boolean
  initial: string
}

export default function NavMobileMenu({ links, publicLinks, displayName, isAdmin, initial }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex md:hidden items-center gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
        <span className="font-display text-sm text-brand-bg leading-none">{initial}</span>
      </div>

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-[5px] items-center justify-center w-11 h-11"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span
          className={`block w-5 h-[1.5px] bg-brand-text origin-center transition-transform duration-200 ${
            open ? 'rotate-45 translate-y-[6.5px]' : ''
          }`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-brand-text transition-opacity duration-200 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-brand-text origin-center transition-transform duration-200 ${
            open ? '-rotate-45 -translate-y-[6.5px]' : ''
          }`}
        />
      </button>

      {/* Slide-down panel */}
      {open && (
        <div className="absolute top-16 left-0 right-0 z-40 bg-brand-surface border-b border-brand-border px-6 py-6 flex flex-col gap-1">
          {publicLinks.length > 0 && (
            <>
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs text-brand-muted hover:text-brand-gold uppercase tracking-[0.2em] transition-colors flex items-center min-h-[44px]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-brand-border my-2" />
            </>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors flex items-center min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <span className="font-mono text-xs text-brand-gold uppercase tracking-widest flex items-center min-h-[44px]">
              Admin
            </span>
          )}
          <div className="h-px bg-brand-border my-2" />
          <span className="font-mono text-[11px] text-brand-muted truncate py-1">{displayName}</span>
          <div className="min-h-[44px] flex items-center">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  )
}
