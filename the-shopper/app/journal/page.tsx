import Link from 'next/link'
import { featuredPost, gridPosts } from './posts'
import SiteNav from '@/components/SiteNav'

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      <SiteNav activePath="/journal" />

      <main className="flex-1 flex flex-col">

        {/* Hero */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20">
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
            The Journal
          </p>
          <h1 className="font-display text-[clamp(3.5rem,9vw,7rem)] text-brand-text uppercase leading-none mb-6">
            Style. Culture. Heat.
          </h1>
          <p className="font-sans text-brand-muted text-base leading-relaxed max-w-[480px]">
            Outfit breakdowns, item of the week, and everything worth wearing right now.
          </p>
        </section>

        {/* Featured post */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-12"
          aria-labelledby="featured-heading"
        >
          <Link
            href={`/journal/${featuredPost.slug}`}
            className="grid grid-cols-1 md:grid-cols-2 bg-[#0e0e10] border border-white/5 hover:border-brand-gold/30 transition-colors group"
          >
            {/* Left: text content */}
            <div className="flex-1 p-8 sm:p-12 flex flex-col">
              <span className="inline-block self-start bg-brand-gold text-brand-bg font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 mb-8 leading-none">
                Featured
              </span>
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
                {featuredPost.category}
              </p>
              <h2
                id="featured-heading"
                className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-brand-text uppercase leading-none mb-6"
              >
                {featuredPost.title}
              </h2>
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.2em] mb-6">
                {featuredPost.date}
              </p>
              <p className="font-sans text-brand-muted text-base leading-relaxed mb-8 max-w-[560px]">
                {featuredPost.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-brand-gold uppercase tracking-[0.2em] mt-auto group-hover:gap-3 transition-all">
                Read More <span aria-hidden="true">→</span>
              </span>
            </div>

            {/* Right: image */}
            {featuredPost.image && (
              <div className="h-[400px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </Link>
        </section>

        {/* Posts grid */}
        <section
          className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-20 sm:pb-28"
          aria-labelledby="posts-heading"
        >
          <h2 id="posts-heading" className="sr-only">
            Recent posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gridPosts.map(({ slug, category, title, excerpt, image }) => (
              <Link
                key={slug}
                href={`/journal/${slug}`}
                className="group bg-[#0e0e10] border border-white/5 p-7 flex flex-col gap-4 border-b-2 border-b-transparent hover:border-b-brand-gold transition-colors overflow-hidden"
              >
                {image && (
                  <div className="-mx-7 -mt-7">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full object-cover h-48" />
                  </div>
                )}
                <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em]">
                  {category}
                </p>
                <h3 className="font-display text-[1.75rem] text-brand-text uppercase leading-tight">
                  {title}
                </h3>
                <p className="font-sans text-brand-muted text-sm leading-relaxed flex-1">
                  {excerpt}
                </p>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] text-brand-gold uppercase tracking-[0.2em] mt-2 group-hover:gap-3 transition-all">
                  Read More <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter strip */}
        <section className="bg-[#0e0e10] border-y border-white/5 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-brand-text uppercase leading-none mb-3">
                Stay in the Loop
              </h2>
              <p className="font-sans text-brand-muted text-sm leading-relaxed mb-8">
                Drop your email. We will tell you when something worth knowing drops.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3"
                aria-label="Newsletter signup"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="flex-1 bg-brand-bg border border-brand-border text-brand-text font-sans px-4 py-3 text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors min-h-[48px]"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 min-h-[48px] hover:bg-brand-gold-hover focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-brand-gold py-16 sm:py-20" aria-labelledby="journal-cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <h2
              id="journal-cta-heading"
              className="font-display text-[clamp(2rem,5vw,4rem)] text-brand-bg uppercase leading-none text-center sm:text-left"
            >
              See Something You Want?
            </h2>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center justify-center bg-brand-bg text-brand-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-10 min-h-[52px] hover:bg-brand-surface focus-visible:ring-2 focus-visible:ring-brand-bg focus-visible:ring-offset-2 focus-visible:ring-offset-brand-gold transition-colors whitespace-nowrap"
            >
              Start a Request →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
