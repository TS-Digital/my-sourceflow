import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import AdminRequestActions from '@/components/AdminRequestActions'
import type { Status } from '@/lib/types'

const STATUS_TIMELINE = ['New', 'In Progress', 'Sourced', 'Completed']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AdminRequestDetailPage({
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

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: request } = await supabase
    .from('requests')
    .select('*, statuses(id, name), profiles!fk_requests_client(full_name, phone)')
    .eq('id', id)
    .single()

  if (!request) notFound()

  const { data: notes } = await supabase
    .from('request_notes')
    .select('id, note_text, created_at, author_role, profiles!fk_request_notes_admin(full_name)')
    .eq('request_id', id)
    .order('created_at', { ascending: true })

  const { data: statuses } = await supabase
    .from('statuses')
    .select('id, name')
    .order('id')

  type StatusRow = { id: number; name: string } | null
  type ProfileRow = { full_name: string; phone?: string | null } | null

  const statusName = (request.statuses as StatusRow)?.name ?? 'New'
  const statusId = (request.statuses as StatusRow)?.id ?? 1
  const statusIdx = STATUS_TIMELINE.indexOf(statusName)
  const clientProfile = request.profiles as ProfileRow
  const shortId = request.id.slice(0, 8).toUpperCase()

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-mono text-[10px] text-brand-muted hover:text-brand-text uppercase tracking-widest mb-8 transition-colors"
        >
          ← Queue
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2">
              #{shortId} · {clientProfile?.full_name ?? '—'}
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
          {/* Main */}
          <div className="md:col-span-2 space-y-5">
            {/* Details */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-xl text-brand-text uppercase">
                  Request Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  { label: 'Client', value: clientProfile?.full_name },
                  { label: 'Phone', value: clientProfile?.phone },
                  { label: 'Brand', value: request.brand },
                  { label: 'Size', value: request.size },
                  { label: 'Colour', value: request.colour },
                  {
                    label: 'Budget',
                    value: request.budget_gbp != null ? `£${request.budget_gbp}` : null,
                  },
                  {
                    label: 'Quoted Price',
                    value: request.quoted_price != null ? `£${request.quoted_price} (${request.payment_status})` : null,
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
                      Client Notes
                    </p>
                    <p className="font-sans text-sm text-brand-text leading-relaxed">
                      {request.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge notes */}
            <div className="bg-brand-surface border border-brand-border">
              <div className="px-6 py-4 border-b border-brand-border">
                <h2 className="font-display text-xl text-brand-text uppercase">
                  Concierge Notes
                </h2>
              </div>
              <div className="p-6">
                {!notes?.length ? (
                  <p className="font-sans text-sm text-brand-muted">No notes yet.</p>
                ) : (
                  <div className="space-y-5">
                    {notes.map((note) => {
                      const author = (Array.isArray(note.profiles) ? note.profiles[0] : note.profiles) as { full_name: string } | null
                      const isClientReply = note.author_role === 'client'
                      return (
                        <div
                          key={note.id}
                          className={`border-l-2 pl-4 ${isClientReply ? 'border-brand-border-strong' : 'border-brand-gold'}`}
                        >
                          <p className="font-mono text-[10px] text-brand-muted mb-1.5">
                            {author?.full_name ?? (isClientReply ? 'Client' : 'Admin')}
                            {isClientReply && ' · Client Reply'} · {formatDate(note.created_at)}
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

          {/* Sidebar */}
          <div>
            <AdminRequestActions
              requestId={request.id}
              currentStatusId={statusId}
              statuses={(statuses ?? []) as Status[]}
              statusTimeline={STATUS_TIMELINE}
              currentStatusName={statusName}
              statusIdx={statusIdx}
              quotedPrice={request.quoted_price}
              paymentStatus={request.payment_status}
            />
          </div>
        </div>
      </main>
    </>
  )
}
