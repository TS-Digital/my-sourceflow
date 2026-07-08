'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientReplyForm({ requestId }: { requestId: string }) {
  const [noteText, setNoteText] = useState('')
  const [msg, setMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const submit = () => {
    if (!noteText.trim()) return
    startTransition(async () => {
      setMsg('')
      try {
        const res = await fetch(`/api/requests/${requestId}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note_text: noteText.trim() }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setMsg(json.error ?? 'Something went wrong.')
          return
        }
        setNoteText('')
        setMsg('Reply sent.')
        router.refresh()
      } catch {
        setMsg('Something went wrong.')
      }
    })
  }

  const inputCls =
    'w-full bg-brand-bg border border-brand-border text-brand-text font-sans px-3 py-2.5 text-sm ' +
    'focus:outline-none focus:border-brand-gold transition-colors'

  return (
    <div className="bg-brand-surface border border-brand-border p-5">
      <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-3">
        Reply to Your Concierge
      </p>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={3}
        placeholder="Write a reply…"
        className={`${inputCls} resize-none mb-3`}
      />
      <button
        onClick={submit}
        disabled={isPending || !noteText.trim()}
        className="w-full bg-brand-gold text-brand-bg font-mono text-[10px] font-bold tracking-widest uppercase py-3 min-h-[44px] hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send Reply'}
      </button>
      {msg && <p className="mt-2 font-mono text-[10px] text-brand-muted">{msg}</p>}
    </div>
  )
}
