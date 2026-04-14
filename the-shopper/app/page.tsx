import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const TICKER_SEGMENT =
  'THE SHOPPER\u2003\u2736\u2003YOU WANT IT YOU GOT IT\u2003\u2736\u2003LUXURY PERSONAL SHOPPING\u2003\u2736\u2003'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* Nav */}
      <header className="w-full px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo-white.png"
            alt="The Shopper"
            width={150}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/login"
          className="font-mono text-[11px] text-brand-text hover:text-brand-gold transition-colors uppercase tracking-[0.2em]"
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 md:py-16 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">

            {/* Left: headline + subtitle + CTA */}
            <div>
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-5">
                Luxury Personal Shopping
              </p>

              <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-brand-text uppercase leading-none mb-2">
                You Want It
              </h1>
              <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-brand-gold uppercase leading-none mb-8">
                You Got It
              </h1>

              <p className="font-sans text-brand-muted text-base leading-relaxed mb-10 max-w-[360px]">
                Your personal shopping concierge.
              </p>

              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 min-h-[48px] hover:bg-brand-gold-hover transition-colors"
              >
                Get Started →
              </Link>
            </div>

            {/* Right: mascot */}
            <div className="flex items-center justify-center order-first md:order-last">
              <div className="animate-float">
                <Image
                  src="/mascot-landing.jpg"
                  alt="The Shopper mascot"
                  width={480}
                  height={480}
                  className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[480px] object-contain select-none"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling gold ticker */}
        <div className="bg-brand-gold overflow-hidden py-2.5">
          <div className="flex animate-ticker" style={{ width: 'max-content' }}>
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-mono text-[10px] sm:text-[11px] text-brand-bg tracking-[0.18em] uppercase whitespace-nowrap"
              >
                {TICKER_SEGMENT.repeat(6)}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
