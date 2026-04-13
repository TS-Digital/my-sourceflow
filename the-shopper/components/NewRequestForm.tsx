'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inputCls =
  'w-full bg-brand-bg border border-brand-border text-brand-text px-4 py-3 text-sm ' +
  'placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors'

const labelCls = 'block text-[10px] text-brand-muted uppercase tracking-widest mb-2'

export default function NewRequestForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error: insertError } = await supabase.from('requests').insert({
      client_id: user.id,
      status_id: 1, // New
      item_name: data.get('item_name') as string,
      brand: (data.get('brand') as string) || null,
      budget_gbp: data.get('budget_gbp') ? Number(data.get('budget_gbp')) : null,
      size: (data.get('size') as string) || null,
      colour: (data.get('colour') as string) || null,
      notes: (data.get('notes') as string) || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface border border-brand-border p-8 space-y-6">
      {error && (
        <div className="p-3 bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className={labelCls}>
            Item Name <span className="text-brand-gold">*</span>
          </label>
          <input
            name="item_name"
            required
            className={inputCls}
            placeholder="e.g. Nike Air Jordan 1 Retro High OG"
          />
        </div>

        <div>
          <label className={labelCls}>Brand</label>
          <input
            name="brand"
            className={inputCls}
            placeholder="e.g. Nike, Gucci, Off-White"
          />
        </div>

        <div>
          <label className={labelCls}>Budget (£)</label>
          <input
            name="budget_gbp"
            type="number"
            step="0.01"
            min="0"
            className={inputCls}
            placeholder="500"
          />
        </div>

        <div>
          <label className={labelCls}>Size</label>
          <input
            name="size"
            className={inputCls}
            placeholder="e.g. UK 9, S, 30x32"
          />
        </div>

        <div>
          <label className={labelCls}>Colour</label>
          <input
            name="colour"
            className={inputCls}
            placeholder="e.g. Black, University Red"
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Additional Notes</label>
          <textarea
            name="notes"
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Condition preferences, specific retailers, occasion details…"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-gold text-brand-bg text-xs font-semibold tracking-widest uppercase px-8 py-3 hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
        <a
          href="/dashboard"
          className="text-xs text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
