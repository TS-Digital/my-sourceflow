import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: requests } = await supabase
    .from('requests')
    .select(
      'id, item_name, brand, budget_gbp, created_at, statuses(name), profiles!fk_requests_client(full_name)'
    )
    .order('created_at', { ascending: false })

  const all = requests ?? []

  type StatusRow = { name: string } | null
  type ProfileRow = { full_name: string } | null

  const statusOf = (r: (typeof all)[0]) => (r.statuses as StatusRow)?.name ?? 'New'

  const stats = {
    total: all.length,
    new: all.filter((r) => statusOf(r) === 'New').length,
    inProgress: all.filter((r) => statusOf(r) === 'In Progress').length,
    sourced: all.filter((r) => statusOf(r) === 'Sourced').length,
    completed: all.filter((r) => statusOf(r) === 'Completed').length,
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
            Concierge View
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-text uppercase">
            Request Queue
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Total', value: stats.total },
            { label: 'New', value: stats.new },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Sourced', value: stats.sourced },
            { label: 'Done', value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="bg-brand-surface border border-brand-border p-4 min-w-0">
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2 whitespace-normal leading-tight">
                {s.label}
              </p>
              <p className="font-display text-3xl text-brand-text">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Request list */}
        <div className="bg-brand-surface border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-display text-xl text-brand-text uppercase">All Requests</h2>
          </div>

          {all.length === 0 ? (
            <div className="px-6 py-16 text-center font-sans text-sm text-brand-muted">
              No requests in the queue.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-border">
                      {['Client', 'Item', 'Budget', 'Status', 'Date', ''].map((h) => (
                        <th
                          key={h}
                          className="text-left px-6 py-3 font-mono text-[10px] text-brand-muted uppercase tracking-widest font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {all.map((req) => {
                      const status = statusOf(req)
                      const client = (req.profiles as ProfileRow)?.full_name ?? '—'
                      return (
                        <tr key={req.id} className="hover:bg-brand-elevated transition-colors">
                          <td className="px-6 py-4 font-sans text-sm text-brand-text">{client}</td>
                          <td className="px-6 py-4">
                            <p className="font-sans text-sm text-brand-text">{req.item_name}</p>
                            {req.brand && (
                              <p className="font-mono text-[10px] text-brand-muted mt-0.5 uppercase tracking-wide">
                                {req.brand}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm text-brand-muted">
                            {req.budget_gbp != null ? `£${req.budget_gbp}` : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-brand-muted whitespace-nowrap">
                            {new Date(req.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/admin/${req.id}`}
                              className="font-mono text-[10px] text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors"
                            >
                              Open →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-brand-border">
                {all.map((req) => {
                  const status = statusOf(req)
                  const client = (req.profiles as ProfileRow)?.full_name ?? '—'
                  return (
                    <Link
                      key={req.id}
                      href={`/admin/${req.id}`}
                      className="flex flex-col gap-2 px-5 py-4 hover:bg-brand-elevated transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm text-brand-text font-medium truncate">
                            {req.item_name}
                          </p>
                          {req.brand && (
                            <p className="font-mono text-[10px] text-brand-muted mt-0.5 uppercase tracking-wide">
                              {req.brand}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-brand-muted">{client}</span>
                        {req.budget_gbp != null && (
                          <span className="font-mono text-[10px] text-brand-muted">
                            £{req.budget_gbp}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-brand-muted ml-auto">
                          {new Date(req.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
