import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import SiteNav from '@/components/SiteNav'
import StatusBadge from '@/components/StatusBadge'
import LeaveReviewForm from '@/components/LeaveReviewForm'

const TICKER_SEGMENT =
  'THE SHOPPER\u2003\u2736\u2003YOU WANT IT YOU GOT IT\u2003\u2736\u2003LUXURY PERSONAL SHOPPING\u2003\u2736\u2003'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin')

  const { data: requests } = await supabase
    .from('requests')
    .select('id, item_name, brand, budget_gbp, created_at, statuses(name)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const all = requests ?? []
  const stats = {
    total: all.length,
    new: all.filter((r) => ((Array.isArray(r.statuses) ? r.statuses[0] : r.statuses) as { name: string } | null)?.name === 'New').length,
    inProgress: all.filter(
      (r) => ((Array.isArray(r.statuses) ? r.statuses[0] : r.statuses) as { name: string } | null)?.name === 'In Progress'
    ).length,
    completed: all.filter(
      (r) => ((Array.isArray(r.statuses) ? r.statuses[0] : r.statuses) as { name: string } | null)?.name === 'Completed'
    ).length,
  }

  const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-brand-bg">
      <SiteNav activePath="/dashboard" />
        {/* Gold scrolling ticker */}
        <div className="bg-brand-gold overflow-hidden py-2.5">
          <div className="flex animate-ticker" style={{ width: 'max-content' }}>
            {/* Two identical copies — animation translates by -50% for seamless loop */}
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

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Left: text + stats + CTAs */}
            <div>
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">
                Personal Shopping Concierge
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brand-text uppercase leading-none mb-4">
                Welcome Back
                <br />
                <span className="text-brand-gold">{firstName}</span>
              </h1>
              <p className="font-sans text-brand-muted text-base leading-relaxed mb-8 max-w-sm">
                Your luxury concierge is ready. Browse your orders below or place a new request.
              </p>

              {/* Stats — 2×2 on mobile, 4 cols on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Total', value: stats.total },
                  { label: 'New', value: stats.new },
                  { label: 'In Progress', value: stats.inProgress },
                  { label: 'Done', value: stats.completed },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-brand-surface border border-brand-border p-4 min-w-0"
                  >
                    <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2 whitespace-normal leading-tight">
                      {s.label}
                    </p>
                    <p className="font-display text-4xl text-brand-text">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/requests/new"
                  className="inline-flex items-center justify-center bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-[0.15em] uppercase px-6 min-h-[44px] hover:bg-brand-gold-hover transition-colors"
                >
                  New Request
                </Link>
                <a
                  href="#requests"
                  className="inline-flex items-center justify-center border border-brand-border text-brand-text font-mono text-[11px] tracking-[0.15em] uppercase px-6 min-h-[44px] hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  View All Orders
                </a>
              </div>
            </div>

            {/* Right: mascot — below text on mobile, right col on desktop */}
            <div className="flex items-center justify-center order-first md:order-last">
              <div className="animate-float">
                <Image
                  src="/mascot.jpg"
                  alt="The Shopper mascot"
                  width={460}
                  height={460}
                  className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[380px] lg:max-w-[460px] object-contain select-none"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Request cards */}
        <section id="requests" className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text uppercase tracking-wide">
              Your Requests
            </h2>
          </div>

          {all.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border px-6 py-16 text-center">
              <p className="font-sans text-brand-muted mb-4">No requests yet.</p>
              <Link
                href="/requests/new"
                className="font-mono text-xs text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors"
              >
                Place your first request →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {all.map((req) => {
                const status = ((Array.isArray(req.statuses) ? req.statuses[0] : req.statuses) as { name: string } | null)?.name ?? 'New'
                return (
                  <Link
                    key={req.id}
                    href={`/requests/${req.id}`}
                    className="bg-brand-surface border border-brand-border px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-brand-gold/40 hover:bg-brand-elevated transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      {req.brand && (
                        <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-1">
                          {req.brand}
                        </p>
                      )}
                      <p className="font-sans text-brand-text font-medium group-hover:text-brand-gold transition-colors truncate">
                        {req.item_name}
                      </p>
                      <p className="font-mono text-[10px] text-brand-muted mt-1 sm:hidden uppercase tracking-wide">
                        {new Date(req.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                      <p className="font-mono text-[10px] text-brand-muted uppercase tracking-wide hidden sm:block">
                        {new Date(req.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      {req.budget_gbp != null && (
                        <span className="font-mono text-xs text-brand-muted">
                          £{req.budget_gbp}
                        </span>
                      )}
                      <StatusBadge status={status} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Leave a Review */}
        {stats.completed > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
            <div className="mb-5">
              <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-1">
                Share Your Experience
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-brand-text uppercase tracking-wide">
                Leave a Review
              </h2>
            </div>
            <LeaveReviewForm
              userId={user.id}
              clientName={profile?.full_name ?? user.email?.split('@')[0] ?? 'Client'}
            />
          </section>
        )}
    </div>
  )
}
