'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Status } from '@/lib/types'


interface Props {
  requestId: string
  currentStatusId: number
  statuses: Status[]
  statusTimeline: string[]
  currentStatusName: string
  statusIdx: number
}

export default function AdminRequestActions({
  requestId,
  currentStatusId,
  statuses,
  statusTimeline,
  currentStatusName,
  statusIdx,
}: Props) {
  const [selectedStatusId, setSelectedStatusId] = useState(currentStatusId)
  const [noteText, setNoteText] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [noteMsg, setNoteMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const saveStatus = () => {
    startTransition(async () => {
      setStatusMsg('')
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: selectedStatusId }),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatusMsg(json.error ?? 'Something went wrong.')
        return
      }
      setStatusMsg('Saved.')
      router.refresh()
    })
  }

  const addNote = () => {
    if (!noteText.trim()) return
    startTransition(async () => {
      setNoteMsg('')
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('request_notes').insert({
        request_id: requestId,
        admin_id: user.id,
        note_text: noteText.trim(),
      })

      if (error) {
        setNoteMsg(error.message)
        return
      }
      setNoteText('')
      setNoteMsg('Note added.')
      router.refresh()
    })
  }

  const inputCls =
    'w-full bg-brand-bg border border-brand-border text-brand-text font-sans px-3 py-2.5 text-sm ' +
    'focus:outline-none focus:border-brand-gold transition-colors'

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="bg-brand-surface border border-brand-border p-5">
        <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-4">
          Progress
        </p>
        <div className="space-y-3">
          {statusTimeline.map((step, i) => {
            const active = i <= statusIdx
            const current = i === statusIdx
            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                    current
                      ? 'bg-brand-gold ring-2 ring-brand-gold/20'
                      : active
                        ? 'bg-brand-gold'
                        : 'bg-brand-border-strong'
                  }`}
                />
                <span
                  className={`font-mono text-xs transition-colors ${
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

      {/* Update status */}
      <div className="bg-brand-surface border border-brand-border p-5">
        <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-3">
          Update Status
        </p>
        <select
          value={selectedStatusId}
          onChange={(e) => setSelectedStatusId(Number(e.target.value))}
          className={`${inputCls} mb-3`}
        >
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          onClick={saveStatus}
          disabled={isPending}
          className="w-full bg-brand-gold text-brand-bg font-mono text-[10px] font-bold tracking-widest uppercase py-3 min-h-[44px] hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
        >
          Save Status
        </button>
        {statusMsg && (
          <p className="mt-2 font-mono text-[10px] text-brand-muted">{statusMsg}</p>
        )}
      </div>

      {/* Add note */}
      <div className="bg-brand-surface border border-brand-border p-5">
        <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-3">
          Concierge Note
        </p>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          placeholder="Update for the client…"
          className={`${inputCls} resize-none mb-3`}
        />
        <button
          onClick={addNote}
          disabled={isPending || !noteText.trim()}
          className="w-full border border-brand-border text-brand-text font-mono text-[10px] font-bold tracking-widest uppercase py-3 min-h-[44px] hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-40"
        >
          Add Note
        </button>
        {noteMsg && (
          <p className="mt-2 font-mono text-[10px] text-brand-muted">{noteMsg}</p>
        )}
      </div>
    </div>
  )
}
