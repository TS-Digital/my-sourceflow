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
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1.5">
            Concierge View
          </p>
          <h1 className="font-display text-3xl text-brand-text">Request Queue</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total },
            { label: 'New', value: stats.new },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Sourced', value: stats.sourced },
            { label: 'Completed', value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="bg-brand-surface border border-brand-border p-5">
              <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-2">
                {s.label}
              </p>
              <p className="font-display text-3xl text-brand-text">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-brand-surface border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-display text-lg text-brand-text">All Requests</h2>
          </div>

          {all.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-brand-muted">
              No requests in the queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    {['Client', 'Item', 'Budget', 'Status', 'Date', ''].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-[10px] text-brand-muted uppercase tracking-widest font-medium"
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
                        <td className="px-6 py-4 text-sm text-brand-text">{client}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-brand-text">{req.item_name}</p>
                          {req.brand && (
                            <p className="text-xs text-brand-muted mt-0.5">{req.brand}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-muted">
                          {req.budget_gbp != null ? `£${req.budget_gbp}` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-brand-muted whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/${req.id}`}
                            className="text-[10px] text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors"
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
          )}
        </div>
      </main>
    </>
  )
}
