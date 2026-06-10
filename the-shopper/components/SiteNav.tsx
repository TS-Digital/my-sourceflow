import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions'
import SiteNavMobile from './SiteNavMobile'

const PUBLIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
]

const APP_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'New Request', href: '/requests/new' },
]

interface Props {
  activePath?: string
}

export default async function SiteNav({ activePath = '' }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <header className="relative w-full px-4 sm:px-8 py-5 flex items-center justify-between">
      <Link href={isLoggedIn ? '/dashboard' : '/'} aria-label="The Shopper home">
        <Image
          src="/logo-white.png"
          alt="The Shopper"
          width={150}
          height={40}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>

      <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
        {PUBLIC_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:text-brand-gold ${
              activePath === href
                ? 'text-brand-gold'
                : 'text-brand-muted hover:text-brand-gold'
            }`}
          >
            {label}
          </Link>
        ))}
        {isLoggedIn && (
          <>
            <span className="w-px h-4 bg-brand-border" aria-hidden="true" />
            {APP_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:text-brand-gold ${
                  activePath === href
                    ? 'text-brand-gold'
                    : 'text-brand-muted hover:text-brand-gold'
                }`}
              >
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <SiteNavMobile
          publicLinks={PUBLIC_LINKS}
          appLinks={isLoggedIn ? APP_LINKS : []}
          activePath={activePath}
        />
        {isLoggedIn ? (
          <form action={signOut}>
            <button
              type="submit"
              className="font-mono text-[11px] text-brand-text hover:text-brand-gold focus-visible:text-brand-gold transition-colors uppercase tracking-[0.2em]"
            >
              Sign Out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="font-mono text-[11px] text-brand-text hover:text-brand-gold focus-visible:text-brand-gold transition-colors uppercase tracking-[0.2em]"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}
