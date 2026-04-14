import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import NavMobileMenu from './NavMobileMenu'

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
  const initial = displayName.charAt(0).toUpperCase() || '?'
  const homeHref = isAdmin ? '/admin' : '/dashboard'

  const links = isAdmin
    ? [{ href: '/admin', label: 'Queue' }]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/requests/new', label: 'New Request' },
      ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-brand-bg/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo — left */}
        <Link href={homeHref} className="flex-shrink-0">
          <Image
            src="/logo-white.png"
            alt="The Shopper"
            width={130}
            height={34}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop centre links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <span className="font-mono text-[11px] text-brand-gold uppercase tracking-widest">
              Admin
            </span>
          )}
        </div>

        {/* Desktop right: avatar + sign out */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
            <span className="font-display text-sm text-brand-bg leading-none">{initial}</span>
          </div>
          <LogoutButton />
        </div>

        {/* Mobile: hamburger */}
        <NavMobileMenu
          links={links}
          displayName={displayName}
          isAdmin={isAdmin}
          initial={initial}
        />
      </nav>
    </header>
  )
}
