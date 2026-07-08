import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '../posts'
import SiteNav from '@/components/SiteNav'

function renderWithBoldPhrases(text: string) {
  // Bold "Phrase:" at the start of any sentence
  const sentences = text.split(/(?<=[.!?]) +/)
  return (
    <>
      {sentences.map((sentence, i) => {
        const m = sentence.match(/^([A-Z][^:]+:)([\s\S]*)$/)
        return (
          <span key={i}>
            {i > 0 ? ' ' : null}
            {m ? (
              <>
                <strong className="text-brand-gold">{m[1]}</strong>
                {m[2]}
              </>
            ) : sentence}
          </span>
        )
      })}
    </>
  )
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      <SiteNav activePath="/journal" />

      <main className="flex-1 flex flex-col">

        {/* Back link + article */}
        <article className="max-w-3xl mx-auto w-full px-4 sm:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28">

          {/* Back */}
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-mono text-[10px] text-brand-gold uppercase tracking-[0.2em] mb-12 hover:gap-3 transition-all"
          >
            <span aria-hidden="true">←</span> Back to Journal
          </Link>

          {/* Header */}
          <header>
            <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
              {post.category}
            </p>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] text-brand-text uppercase leading-none mb-6">
              {post.title}
            </h1>
            {post.date && (
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.2em] mb-10">
                {post.date}
              </p>
            )}
            <p className="font-sans text-brand-text font-semibold text-xl leading-relaxed mb-12 border-l-2 border-brand-gold pl-5">
              {post.excerpt}
            </p>
          </header>

          {/* Hero image */}
          {post.image && (
            <div className="w-full h-64 md:h-[500px] mb-10 bg-[#0e0e10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Body */}
          {post.content && (
            <div>
              {post.content.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-brand-text text-lg font-medium leading-relaxed mb-6"
                >
                  {renderWithBoldPhrases(para)}
                </p>
              ))}
            </div>
          )}
        </article>

        {/* CTA Banner */}
        <section className="bg-brand-gold py-16 sm:py-20" aria-labelledby="post-cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <h2
              id="post-cta-heading"
              className="font-display text-[clamp(2rem,5vw,4rem)] text-brand-bg uppercase leading-none text-center sm:text-left"
            >
              Want the Item?
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
