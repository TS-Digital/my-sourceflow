import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
]

const TIERS = [
  {
    tier: 'Tier 01',
    name: 'Standard Sourcing',
    price: '£25',
    priceNote: 'service fee + item cost',
    highlight: false,
    badge: null as string | null,
    features: [
      'Single item sourcing',
      'UK & EU retailers',
      '3–5 day turnaround',
      'Order tracking via dashboard',
      'Email updates',
    ],
  },
  {
    tier: 'Tier 02',
    name: 'Priority Sourcing',
    price: '£50',
    priceNote: 'service fee + item cost',
    highlight: true,
    badge: 'Most Popular' as string | null,
    features: [
      'Everything in Standard',
      'Worldwide sourcing',
      '24–48hr turnaround',
      'WhatsApp updates',
      'Authentication check',
    ],
  },
  {
    tier: 'Tier 03',
    name: 'Concierge',
    price: 'Custom',
    priceNote: 'pricing',
    highlight: false,
    badge: null as string | null,
    features: [
      'Everything in Priority',
      'Dedicated sourcing agent',
      'Multiple items per request',
      'Rare & limited edition hunting',
      'Full white-glove service',
    ],
  },
]

const GUARANTEES = [
  {
    title: 'Verified Sources',
    desc: 'We only source from trusted retailers and resellers.',
  },
  {
    title: 'Secure Payments',
    desc: 'Your payment is protected until delivery is confirmed.',
  },
  {
    title: 'Full Tracking',
    desc: 'Monitor every step of your order on your dashboard.',
  },
  {
    title: 'Real Support',
    desc: 'Speak to a real person, not a bot.',
  },
]

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 7L5.5 10.5L12 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* Nav */}
      <header className="w-full px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link href="/" aria-label="The Shopper home">
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
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:text-brand-gold ${
                label === 'Services'
                  ? 'text-brand-gold'
                  : 'text-brand-muted hover:text-brand-gold'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="font-mono text-[11px] text-brand-text hover:text-brand-gold focus-visible:text-brand-gold transition-colors uppercase tracking-[0.2em]"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col">

        {/* Hero */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24">
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
            What We Offer
          </p>
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-brand-text uppercase leading-none mb-6">
            The Service
          </h1>
          <p className="font-sans text-brand-muted text-base leading-relaxed max-w-[480px]">
            We handle the hunt. You handle the flex. Personal shopping done properly.
          </p>
        </section>

        {/* Tier cards */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-20 sm:pb-28"
          aria-labelledby="tiers-heading"
        >
          <h2 id="tiers-heading" className="sr-only">
            Service tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(({ tier, name, price, priceNote, highlight, badge, features }) => (
              <div
                key={tier}
                className={`relative flex flex-col p-8 bg-[#0e0e10] ${
                  highlight
                    ? 'border border-brand-gold/50'
                    : 'border border-white/5'
                }`}
              >
                {badge && (
                  <span className="absolute top-5 right-5 bg-brand-gold text-brand-bg font-mono text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 leading-none">
                    {badge}
                  </span>
                )}

                <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
                  {tier}
                </p>

                <h3 className="font-display text-[2rem] text-brand-text uppercase leading-tight mb-5">
                  {name}
                </h3>

                <div className="flex items-baseline gap-2 mb-7">
                  <span className="font-display text-[2.5rem] text-brand-text leading-none">
                    {price}
                  </span>
                  <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">
                    {priceNote}
                  </span>
                </div>

                <ul className="space-y-3 mb-10 flex-1" role="list">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckIcon className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-brand-muted text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`inline-flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.2em] uppercase min-h-[48px] transition-colors ${
                    highlight
                      ? 'bg-brand-gold text-brand-bg hover:bg-brand-gold-hover'
                      : 'border border-white/15 text-brand-text hover:border-brand-gold/60 hover:text-brand-gold'
                  }`}
                >
                  Get Started →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* What's always included */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-20 sm:pb-28"
          aria-labelledby="always-included-heading"
        >
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
            Every Order
          </p>
          <h2
            id="always-included-heading"
            className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-12"
          >
            Always Included
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {GUARANTEES.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-[#0e0e10] border border-white/5 p-6 flex gap-5"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/40 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-brand-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono text-[12px] text-brand-text uppercase tracking-[0.15em] mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-brand-gold py-16 sm:py-20" aria-labelledby="services-cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2
                id="services-cta-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] text-brand-bg uppercase leading-none mb-2 text-center sm:text-left"
              >
                Got Something Specific in Mind?
              </h2>
              <p className="font-sans text-brand-bg/70 text-sm text-center sm:text-left">
                Tell us what you want and we&apos;ll make it happen.
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center justify-center bg-brand-bg text-brand-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-10 min-h-[52px] hover:bg-brand-surface focus-visible:ring-2 focus-visible:ring-brand-bg focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gold transition-colors whitespace-nowrap"
            >
              Start Your Request →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
