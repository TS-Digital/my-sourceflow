'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Status, PaymentStatus } from '@/lib/types'

interface Props {
  requestId: string
  currentStatusId: number
  statuses: Status[]
  statusTimeline: string[]
  currentStatusName: string
  statusIdx: number
  quotedPrice: number | null
  paymentStatus: PaymentStatus
}

export default function AdminRequestActions({
  requestId,
  currentStatusId,
  statuses,
  statusTimeline,
  statusIdx,
  quotedPrice,
  paymentStatus,
}: Props) {
  const [selectedStatusId, setSelectedStatusId] = useState(currentStatusId)
  const [noteText, setNoteText] = useState('')
  const [priceInput, setPriceInput] = useState(quotedPrice != null ? String(quotedPrice) : '')
  const [statusMsg, setStatusMsg] = useState('')
  const [noteMsg, setNoteMsg] = useState('')
  const [quoteMsg, setQuoteMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const saveStatus = () => {
    startTransition(async () => {
      setStatusMsg('')
      try {
        const res = await fetch(`/api/requests/${requestId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status_id: selectedStatusId }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setStatusMsg(json.error ?? 'Something went wrong.')
          return
        }
        setStatusMsg('Saved.')
        router.refresh()
      } catch {
        setStatusMsg('Something went wrong.')
      }
    })
  }

  const addNote = () => {
    if (!noteText.trim()) return
    startTransition(async () => {
      setNoteMsg('')
      try {
        const res = await fetch(`/api/requests/${requestId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note_text: noteText.trim() }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setNoteMsg(json.error ?? 'Something went wrong.')
          return
        }
        setNoteText('')
        setNoteMsg('Note added.')
        router.refresh()
      } catch {
        setNoteMsg('Something went wrong.')
      }
    })
  }

  const sendQuote = () => {
    const price = Number(priceInput)
    if (!price || price <= 0) {
      setQuoteMsg('Enter a valid price.')
      return
    }
    startTransition(async () => {
      setQuoteMsg('')
      try {
        const res = await fetch(`/api/requests/${requestId}/quote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quoted_price: price }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setQuoteMsg(json.error ?? 'Something went wrong.')
          return
        }
        setQuoteMsg('Quote sent to client.')
        router.refresh()
      } catch {
        setQuoteMsg('Something went wrong.')
      }
    })
  }

  const markPaid = () => {
    startTransition(async () => {
      setQuoteMsg('')
      try {
        const res = await fetch(`/api/requests/${requestId}/mark-paid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setQuoteMsg(json.error ?? 'Something went wrong.')
          return
        }
        setQuoteMsg('Marked as paid.')
        router.refresh()
      } catch {
        setQuoteMsg('Something went wrong.')
      }
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

      {/* Payment */}
      <div className="bg-brand-surface border border-brand-border p-5">
        <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-3">
          Payment
        </p>
        {quotedPrice != null && (
          <p className="font-sans text-sm text-brand-text mb-3">
            Quoted: <strong>£{quotedPrice.toFixed(2)}</strong> ·{' '}
            <span className={paymentStatus === 'paid' ? 'text-brand-gold' : 'text-brand-muted'}>
              {paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          </p>
        )}
        <div className="flex gap-2 mb-3">
          <span className="flex items-center px-3 font-sans text-sm text-brand-muted bg-brand-bg border border-brand-border">
            £
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            placeholder="0.00"
            className={inputCls}
          />
        </div>
        <button
          onClick={sendQuote}
          disabled={isPending || !priceInput}
          className="w-full border border-brand-border text-brand-text font-mono text-[10px] font-bold tracking-widest uppercase py-3 min-h-[44px] hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-40 mb-2"
        >
          {quotedPrice != null ? 'Update Quote' : 'Send Quote'}
        </button>
        {quotedPrice != null && paymentStatus === 'unpaid' && (
          <button
            onClick={markPaid}
            disabled={isPending}
            className="w-full bg-brand-gold text-brand-bg font-mono text-[10px] font-bold tracking-widest uppercase py-3 min-h-[44px] hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
          >
            Mark as Paid
          </button>
        )}
        {quoteMsg && (
          <p className="mt-2 font-mono text-[10px] text-brand-muted">{quoteMsg}</p>
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
