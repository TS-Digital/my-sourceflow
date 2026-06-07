import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
]

const VALUES = [
  {
    title: 'Accuracy',
    desc: 'We get exactly what you ask for. No substitutes, no approximations.',
  },
  {
    title: 'Speed',
    desc: 'Fast turnarounds without cutting corners. Your time matters.',
  },
  {
    title: 'Trust',
    desc: 'Every source verified. Every item authenticated. Your money is safe.',
  },
  {
    title: 'Excellence',
    desc: "We treat every order like it's our own. Nothing leaves without our approval.",
  },
]

const STATS = [
  { value: '100+', label: 'Orders Completed' },
  { value: '48hr', label: 'Average Turnaround' },
  { value: '5★', label: 'Client Satisfaction' },
  { value: '10+', label: 'Brands Sourced' },
]

export default function AboutPage() {
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
                label === 'About'
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
            Our Story
          </p>
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-brand-text uppercase leading-none mb-6">
            Built Different
          </h1>
          <p className="font-sans text-brand-muted text-base leading-relaxed max-w-[520px]">
            The Shopper started with one simple idea: if you know where to look, you can get
            anything. So we built the service we always wanted.
          </p>
        </section>

        {/* Brand story */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-20 sm:pb-28"
          aria-labelledby="who-we-are-heading"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Left: copy */}
            <div>
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
                Who We Are
              </p>
              <h2
                id="who-we-are-heading"
                className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-8"
              >
                Your Plug.
                <br />
                Your Concierge.
              </h2>

              <div className="space-y-5">
                <p className="font-sans text-brand-muted text-base leading-relaxed">
                  The Shopper is a luxury personal shopping concierge based in the UK. We source
                  sneakers, designer clothing, watches, bags, jewellery, and electronics. Whatever
                  you need, wherever it is, we go and get it.
                </p>
                <p className="font-sans text-brand-muted text-base leading-relaxed">
                  We move different. No bots, no algorithms, no guesswork. Just real people with
                  real connects, hunting down exactly what you want at the best possible price.
                </p>
                <p className="font-sans text-brand-muted text-base leading-relaxed">
                  Whether it&apos;s a pair of heat that sold out in seconds or a watch you&apos;ve
                  been chasing for months, we find it. That&apos;s the promise.
                </p>
              </div>
            </div>

            {/* Right: mascot */}
            <div className="flex items-center justify-center order-first md:order-last">
              <div className="animate-float">
                <Image
                  src="/mascot-landing.jpg"
                  alt="The Shopper mascot"
                  width={400}
                  height={400}
                  className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[400px] object-contain select-none"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-20 sm:pb-28"
          aria-labelledby="values-heading"
        >
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
            What We Stand For
          </p>
          <h2
            id="values-heading"
            className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-12"
          >
            The Code
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-[#0e0e10] border border-white/5 p-7 flex gap-5"
              >
                <div className="w-1 h-8 bg-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-mono text-[13px] text-brand-text uppercase tracking-[0.15em] mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-[#0e0e10] border-y border-white/5 py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-[clamp(2.5rem,6vw,4rem)] text-brand-gold leading-none mb-2">
                    {value}
                  </p>
                  <p className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.2em]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-brand-gold py-16 sm:py-20" aria-labelledby="about-cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2
                id="about-cta-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] text-brand-bg uppercase leading-none mb-2 text-center sm:text-left"
              >
                Want In?
              </h2>
              <p className="font-sans text-brand-bg/70 text-sm text-center sm:text-left">
                Join the clients who shop smarter.
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
