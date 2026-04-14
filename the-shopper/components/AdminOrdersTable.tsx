'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'
import type { Status } from '@/lib/types'

interface OrderRow {
  id: string
  item_name: string
  brand: string | null
  budget_gbp: number | null
  created_at: string
  status_id: number
  status_name: string
  client_name: string
}

interface Props {
  orders: OrderRow[]
  statuses: Status[]
}

const selectCls =
  'bg-brand-bg border border-brand-border text-brand-text font-mono text-[10px] ' +
  'tracking-widest uppercase px-2 py-1.5 focus:outline-none focus:border-brand-gold ' +
  'transition-colors cursor-pointer appearance-none pr-6'

export default function AdminOrdersTable({ orders: initial, statuses }: Props) {
  const [orders, setOrders] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = (orderId: string, newStatusId: number) => {
    const newStatusName = statuses.find((s) => s.id === newStatusId)?.name ?? ''

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status_id: newStatusId, status_name: newStatusName } : o
      )
    )
    setSaving(orderId)
    setError(null)

    startTransition(async () => {
      const { error } = await supabase
        .from('requests')
        .update({ status_id: newStatusId })
        .eq('id', orderId)

      setSaving(null)
      if (error) {
        setError(`Failed to update order: ${error.message}`)
        // Revert optimistic update
        setOrders(initial)
      } else {
        router.refresh()
      }
    })
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })

  if (orders.length === 0) {
    return (
      <div className="px-6 py-16 text-center font-sans text-sm text-brand-muted">
        No requests in the queue.
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="px-6 py-3 bg-red-950/50 border-b border-red-900/50 text-red-400 font-mono text-[10px] tracking-wide">
          {error}
        </div>
      )}

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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-brand-elevated transition-colors group"
              >
                <td className="px-6 py-4 font-sans text-sm text-brand-text whitespace-nowrap">
                  {order.client_name}
                </td>
                <td className="px-6 py-4">
                  <p className="font-sans text-sm text-brand-text">{order.item_name}</p>
                  {order.brand && (
                    <p className="font-mono text-[10px] text-brand-muted mt-0.5 uppercase tracking-wide">
                      {order.brand}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-brand-muted whitespace-nowrap">
                  {order.budget_gbp != null ? `£${order.budget_gbp}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <select
                      value={order.status_id}
                      onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                      disabled={saving === order.id}
                      className={`${selectCls} ${saving === order.id ? 'opacity-50' : ''}`}
                      style={{ backgroundImage: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-brand-muted text-[8px]">
                      ▾
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-brand-muted whitespace-nowrap">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`/admin/${order.id}`}
                    className="font-mono text-[10px] text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Open →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-brand-border">
        {orders.map((order) => (
          <div key={order.id} className="px-5 py-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm text-brand-text font-medium truncate">
                  {order.item_name}
                </p>
                {order.brand && (
                  <p className="font-mono text-[10px] text-brand-muted mt-0.5 uppercase tracking-wide">
                    {order.brand}
                  </p>
                )}
              </div>
              <StatusBadge status={order.status_name} />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[10px] text-brand-muted">{order.client_name}</span>
              {order.budget_gbp != null && (
                <span className="font-mono text-[10px] text-brand-muted">£{order.budget_gbp}</span>
              )}
              <span className="font-mono text-[10px] text-brand-muted ml-auto">
                {formatDate(order.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={order.status_id}
                  onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                  disabled={saving === order.id}
                  className={`${selectCls} w-full ${saving === order.id ? 'opacity-50' : ''}`}
                  style={{ backgroundImage: 'none' }}
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-brand-muted text-[8px]">
                  ▾
                </span>
              </div>
              <a
                href={`/admin/${order.id}`}
                className="font-mono text-[10px] text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0"
              >
                Open →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
