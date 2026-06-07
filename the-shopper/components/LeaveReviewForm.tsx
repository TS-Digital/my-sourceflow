'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  clientName: string
}

const inputCls =
  'w-full bg-brand-bg border border-brand-border text-brand-text font-sans px-4 py-3 text-sm ' +
  'placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors min-h-[44px]'

const labelCls = 'block font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2'

export default function LeaveReviewForm({ userId, clientName }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    const form = e.currentTarget
    const data = new FormData(form)
    const quote = (data.get('quote') as string).trim()
    const location = (data.get('location') as string).trim()

    if (!quote) {
      setError('Please write something about your experience.')
      return
    }

    setError('')
    startTransition(async () => {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('reviews').insert({
        user_id: userId,
        client_name: clientName,
        rating,
        quote,
        location: location || null,
      })

      if (dbError) {
        setError(dbError.message)
        return
      }

      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="bg-brand-surface border border-brand-gold/30 px-6 py-10 text-center">
        <p className="font-display text-3xl text-brand-gold uppercase mb-2">Thank You</p>
        <p className="font-sans text-brand-muted text-sm">
          Your review has been submitted and is pending approval.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-surface border border-brand-border p-6 sm:p-8 space-y-6"
    >
      {error && (
        <div className="p-3 bg-red-950/50 border border-red-900/50 text-red-400 font-sans text-sm">
          {error}
        </div>
      )}

      {/* Star rating */}
      <div>
        <label className={labelCls}>
          Rating <span className="text-brand-gold">*</span>
        </label>
        <div
          className="flex gap-1"
          role="group"
          aria-label="Star rating"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHovered(i)}
              aria-label={`${i} star${i > 1 ? 's' : ''}`}
              className={`text-3xl leading-none transition-colors focus-visible:outline-none ${
                Math.max(hovered, rating) >= i
                  ? 'text-brand-gold'
                  : 'text-brand-muted/30'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div>
        <label className={labelCls}>
          Your Review <span className="text-brand-gold">*</span>
        </label>
        <textarea
          name="quote"
          rows={4}
          required
          className={`${inputCls} resize-none`}
          placeholder="Tell us about your experience…"
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>Location</label>
        <input
          name="location"
          className={inputCls}
          placeholder="e.g. London, Lagos, Dubai"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-gold text-brand-bg font-mono text-[11px] font-bold tracking-widest uppercase px-8 min-h-[44px] hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
