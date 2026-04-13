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

  // Clients may only view their own requests
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
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[10px] text-brand-muted hover:text-brand-text uppercase tracking-widest mb-8 transition-colors"
        >
          ← Back
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1.5">
              Request #{shortId}
            </p>
            <h1 className="font-display text-3xl text-brand-text">{request.item_name}</h1>
          </div>
          <div className="flex-shrink-0 pt-1">
            <StatusBadge status={statusName} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main */}
          <div className="col-span-2 space-y-6">
            {/* Details */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-lg text-brand-text">Details</h2>
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
                  { label: 'Last updated', value: formatDate(request.updated_at) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-brand-text">{value || '—'}</p>
                  </div>
                ))}
                {request.notes && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-brand-text leading-relaxed">{request.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge updates */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-lg text-brand-text">Concierge Updates</h2>
              </div>
              <div className="p-6">
                {!notes?.length ? (
                  <p className="text-sm text-brand-muted">
                    No updates yet. Our team will be in touch.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {notes.map((note) => {
                      const admin = note.profiles as { full_name: string } | null
                      return (
                        <div key={note.id} className="border-l-2 border-brand-gold pl-4">
                          <p className="text-[10px] text-brand-muted mb-1.5">
                            {admin?.full_name ?? 'The Shopper team'} ·{' '}
                            {formatDate(note.created_at)}
                          </p>
                          <p className="text-sm text-brand-text leading-relaxed">
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
              <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-4">
                Progress
              </p>
              <div className="space-y-3">
                {STATUS_TIMELINE.map((step, i) => {
                  const active = i <= statusIdx
                  const current = i === statusIdx
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          current
                            ? 'bg-brand-gold ring-2 ring-brand-gold/20'
                            : active
                              ? 'bg-brand-gold'
                              : 'bg-brand-border-strong'
                        }`}
                      />
                      <span
                        className={`text-xs ${active ? 'text-brand-text' : 'text-brand-muted'}`}
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
