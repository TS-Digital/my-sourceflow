import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SiteNav from '@/components/SiteNav'

const TICKER_SEGMENT =
  'THE SHOPPER ✶ YOU WANT IT YOU GOT IT ✶ LUXURY PERSONAL SHOPPING ✶ '

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell Us What You Want',
    desc: 'Drop us the details: brand, style, size, colourway. The more specific, the better.',
  },
  {
    step: '02',
    title: 'We Source It For You',
    desc: "Our network spans retailers, resellers, and drops worldwide. We hunt so you don't have to.",
  },
  {
    step: '03',
    title: 'Receive & Flex',
    desc: "Your piece arrives authenticated and ready to wear. No stress, no L's, just heat.",
  },
]

const CATEGORIES = [
  'Sneakers',
  'Designer Clothing',
  'Watches',
  'Bags',
  'Jewellery',
  'Electronics',
]

type Testimonial = { quote: string; name: string; location: string | null }

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Got me a pair of Off-White Dunks in my size two days before the wedding. Absolute legend.',
    name: 'MARCUS T.',
    location: 'London',
  },
  {
    quote:
      "I've tried every reseller platform. The Shopper is the only one that actually delivers every time.",
    name: 'AISHA K.',
    location: 'Manchester',
  },
  {
    quote:
      "Copped a Patek Philippe I'd been chasing for months. Handled in 72 hours. Crazy service.",
    name: 'JOEL R.',
    location: 'Lagos',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  const { data: approvedReviews } = await supabase
    .from('reviews')
    .select('id, client_name, quote, location')
    .eq('approved', true)
    .order('created_at', { ascending: false })

  const testimonials: Testimonial[] =
    approvedReviews && approvedReviews.length >= 1
      ? approvedReviews.map((r) => ({
          quote: r.quote,
          name: r.client_name,
          location: r.location,
        }))
      : FALLBACK_TESTIMONIALS

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      <SiteNav activePath="/" />


      <main className="flex-1 flex flex-col">

        {/* Hero */}
        <section
          aria-label="Hero"
          className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 md:py-16 flex items-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">

            {/* Left: headline + copy + CTA */}
            <div>
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-5">
                Luxury Personal Shopping
              </p>

              <h1 className="font-display text-[clamp(2.75rem,10vw,8rem)] text-brand-text uppercase leading-none mb-2">
                You Want It
              </h1>
              <h1 className="font-display text-[clamp(2.75rem,10vw,8rem)] text-brand-gold uppercase leading-none mb-6">
                You Got It
              </h1>

              <p className="font-sans text-brand-muted text-base leading-relaxed mb-2 max-w-[360px]">
                Your personal shopping concierge.
              </p>
              <p className="font-mono text-[13px] text-brand-text/60 uppercase tracking-[0.15em] mb-10 max-w-[360px]">
                We source it. You flex it.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 min-h-[48px] hover:bg-brand-gold-hover focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg transition-colors"
                >
                  Get Started →
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center border border-brand-gold text-brand-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 min-h-[48px] hover:bg-brand-gold/10 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right: mascot */}
            <div className="flex items-center justify-center order-first md:order-last">
              <div className="animate-float">
                <Image
                  src="/mascot-landing.jpg"
                  alt="The Shopper mascot"
                  width={480}
                  height={480}
                  className="w-full max-w-[140px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[480px] object-contain select-none"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-12 sm:py-28"
          aria-labelledby="hiw-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
              The Process
            </p>
            <h2
              id="hiw-heading"
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-14"
            >
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="bg-brand-surface border border-brand-gold/20 p-8 flex flex-col gap-4 hover:border-brand-gold/40 transition-colors"
                >
                  <span
                    className="font-display text-[3.5rem] text-brand-gold leading-none"
                    aria-hidden="true"
                  >
                    {step}
                  </span>
                  <h3 className="font-display text-[1.6rem] text-brand-text uppercase leading-tight">
                    {title}
                  </h3>
                  <p className="font-sans text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Source */}
        <section className="py-12 sm:py-28" aria-labelledby="wws-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
              Categories
            </p>
            <h2
              id="wws-heading"
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-14"
            >
              What We Source
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="group bg-brand-surface border border-white/5 px-6 h-24 sm:h-auto sm:py-10 flex items-center justify-center hover:border-brand-gold/40 hover:bg-brand-elevated transition-all"
                >
                  <span className="font-mono text-[11px] text-brand-muted group-hover:text-brand-gold uppercase tracking-[0.25em] transition-colors text-center">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-28" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
              Client Love
            </p>
            <h2
              id="testimonials-heading"
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-text uppercase leading-none mb-14"
            >
              Don&apos;t Take Our Word
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ quote, name, location }) => (
                <figure
                  key={name}
                  className="bg-brand-surface border border-white/5 p-8 flex flex-col gap-5"
                >
                  <span
                    className="font-display text-[4rem] text-brand-gold leading-none select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="font-sans text-brand-text/80 text-sm leading-relaxed -mt-4">
                    {quote}
                  </blockquote>
                  <figcaption className="mt-auto pt-4 border-t border-white/5">
                    <p className="font-mono text-[11px] text-brand-gold uppercase tracking-[0.2em]">
                      {name}
                    </p>
                    <p className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.15em] mt-0.5">
                      {location}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-brand-gold py-16 sm:py-20" aria-labelledby="cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <h2
              id="cta-heading"
              className="font-display text-[clamp(2rem,5vw,4rem)] text-brand-bg uppercase leading-none text-center sm:text-left"
            >
              Ready to Shop Different?
            </h2>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center justify-center bg-brand-bg text-brand-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-10 min-h-[52px] hover:bg-brand-surface focus-visible:ring-2 focus-visible:ring-brand-bg focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gold transition-colors whitespace-nowrap"
            >
              Start Your Request →
            </Link>
          </div>
        </section>

        {/* Scrolling gold ticker */}
        <div className="bg-brand-gold overflow-hidden py-2.5" aria-hidden="true">
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
