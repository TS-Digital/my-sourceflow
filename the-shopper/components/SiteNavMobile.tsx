'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

interface Props {
  publicLinks: NavLink[]
  appLinks: NavLink[]
  activePath: string
}

export default function SiteNavMobile({ publicLinks, appLinks, activePath }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-[5px] items-center justify-center w-10 h-10"
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

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-brand-bg border-b border-brand-border px-4 py-3 flex flex-col">
          {publicLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center min-h-[44px] ${
                activePath === href ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-gold'
              }`}
            >
              {label}
            </Link>
          ))}
          {appLinks.length > 0 && (
            <>
              <div className="h-px bg-brand-border my-1" />
              {appLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center min-h-[44px] ${
                    activePath === href ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-gold'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
