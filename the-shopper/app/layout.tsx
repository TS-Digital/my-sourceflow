import type { Metadata } from 'next'
import { Bebas_Neue, Space_Mono, DM_Sans } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Shopper — Luxury Personal Shopping',
  description: 'Exclusive personal shopping concierge service.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceMono.variable} ${dmSans.variable}`}
    >
      <body>
        {children}
        <footer className="py-6 px-4 text-center font-mono text-[9px] text-brand-muted uppercase tracking-widest space-y-2">
          <p>
            The Shopper is an independent personal shopping service and is not affiliated with, endorsed by, or
            sponsored by any brand referenced on this site.
          </p>
          <p className="space-x-3">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Terms of Service
            </Link>
          </p>
        </footer>
      </body>
    </html>
  )
}
