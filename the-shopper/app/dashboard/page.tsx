import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'

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

  // Admins belong in /admin
  if (profile?.role === 'admin') redirect('/admin')

  const { data: requests } = await supabase
    .from('requests')
    .select('id, item_name, brand, budget_gbp, created_at, statuses(name)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const all = requests ?? []
  const stats = {
    total: all.length,
    new: all.filter((r) => (r.statuses as { name: string } | null)?.name === 'New').length,
    inProgress: all.filter(
      (r) => (r.statuses as { name: string } | null)?.name === 'In Progress'
    ).length,
    completed: all.filter((r) => (r.statuses as { name: string } | null)?.name === 'Completed').length,
  }

  const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1.5">
              Personal Shopping
            </p>
            <h1 className="font-display text-3xl text-brand-text">Welcome back, {firstName}</h1>
          </div>
          <Link
            href="/requests/new"
            className="bg-brand-gold text-brand-bg text-[10px] font-semibold tracking-widest uppercase px-6 py-3 hover:bg-brand-gold-hover transition-colors"
          >
            New Request
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total },
            { label: 'New', value: stats.new },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Completed', value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="bg-brand-surface border border-brand-border p-6">
              <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-3">
                {s.label}
              </p>
              <p className="font-display text-4xl text-brand-text">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Requests list */}
        <div className="bg-brand-surface border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-display text-lg text-brand-text">Your Requests</h2>
          </div>

          {all.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-brand-muted mb-4">No requests yet.</p>
              <Link
                href="/requests/new"
                className="text-xs text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors"
              >
                Place your first request →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {all.map((req) => {
                const status = (req.statuses as { name: string } | null)?.name ?? 'New'
                return (
                  <Link
                    key={req.id}
                    href={`/requests/${req.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-brand-elevated transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-brand-text font-medium group-hover:text-brand-gold transition-colors truncate">
                        {req.item_name}
                      </p>
                      {req.brand && (
                        <p className="text-xs text-brand-muted mt-0.5">{req.brand}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      {req.budget_gbp != null && (
                        <span className="text-xs text-brand-muted">£{req.budget_gbp}</span>
                      )}
                      <StatusBadge status={status} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
