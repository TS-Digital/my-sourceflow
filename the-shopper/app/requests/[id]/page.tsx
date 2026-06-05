import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'

const STATUS_TIMELINE = ['New', 'In Progress', 'Sourced', 'Completed']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: request } = await supabase
    .from('requests')
    .select('*, statuses(id, name)')
    .eq('id', id)
    .single()

  if (!request) notFound()

  if (profile?.role !== 'admin' && request.client_id !== user.id) notFound()

  const { data: notes } = await supabase
    .from('request_notes')
    .select('id, note_text, created_at, profiles!fk_request_notes_admin(full_name)')
    .eq('request_id', id)
    .order('created_at', { ascending: true })

  const statusName: string = (request.statuses as { name: string } | null)?.name ?? 'New'
  const statusIdx = STATUS_TIMELINE.indexOf(statusName)
  const shortId = request.id.slice(0, 8).toUpperCase()
  const backHref = profile?.role === 'admin' ? `/admin/${request.id}` : '/dashboard'

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-[10px] text-brand-muted hover:text-brand-text uppercase tracking-widest mb-8 transition-colors"
        >
          ← Back
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
              Request #{shortId}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-brand-text uppercase">
              {request.item_name}
            </h1>
          </div>
          <div className="sm:flex-shrink-0 sm:pt-1">
            <StatusBadge status={statusName} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main — 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-5">
            {/* Details */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-xl text-brand-text uppercase">Details</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  { label: 'Brand', value: request.brand },
                  { label: 'Size', value: request.size },
                  { label: 'Colour', value: request.colour },
                  {
                    label: 'Budget',
                    value: request.budget_gbp != null ? `£${request.budget_gbp}` : null,
                  },
                  { label: 'Submitted', value: formatDate(request.created_at) },
                  { label: 'Updated', value: formatDate(request.updated_at) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="font-sans text-sm text-brand-text">{value || '—'}</p>
                  </div>
                ))}
                {request.notes && (
                  <div className="col-span-2">
                    <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-1">
                      Notes
                    </p>
                    <p className="font-sans text-sm text-brand-text leading-relaxed">
                      {request.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge updates */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-xl text-brand-text uppercase">
                  Concierge Updates
                </h2>
              </div>
              <div className="p-6">
                {!notes?.length ? (
                  <p className="font-sans text-sm text-brand-muted">
                    No updates yet. Our team will be in touch.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {notes.map((note) => {
                      const admin = (Array.isArray(note.profiles) ? note.profiles[0] : note.profiles) as { full_name: string } | null
                      return (
                        <div key={note.id} className="border-l-2 border-brand-gold pl-4">
                          <p className="font-mono text-[10px] text-brand-muted mb-1.5">
                            {admin?.full_name ?? 'The Shopper team'} ·{' '}
                            {formatDate(note.created_at)}
                          </p>
                          <p className="font-sans text-sm text-brand-text leading-relaxed">
                            {note.note_text}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: timeline */}
          <div>
            <div className="bg-brand-surface border border-brand-border p-6">
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-4">
                Progress
              </p>
              <div className="space-y-3">
                {STATUS_TIMELINE.map((step, i) => {
                  const active = i <= statusIdx
                  const current = i === statusIdx
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          current
                            ? 'bg-brand-gold ring-2 ring-brand-gold/20'
                            : active
                              ? 'bg-brand-gold'
                              : 'bg-brand-border-strong'
                        }`}
                      />
                      <span
                        className={`font-mono text-xs ${
                          active ? 'text-brand-text' : 'text-brand-muted'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
