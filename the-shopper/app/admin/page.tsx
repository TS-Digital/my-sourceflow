import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions'
import AdminOrdersTable from '@/components/AdminOrdersTable'

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
      'id, item_name, brand, budget_gbp, created_at, status_id, statuses(id, name), profiles!fk_requests_client(full_name)'
    )
    .order('created_at', { ascending: false })

  const { data: statuses } = await supabase.from('statuses').select('id, name').order('id')

  type StatusRow = { id: number; name: string } | null
  type ProfileRow = { full_name: string } | null

  const all = requests ?? []
  const allStatuses = statuses ?? []

  const statusOf = (r: (typeof all)[0]) => (r.statuses as StatusRow)?.name ?? 'New'
  const statusIdOf = (r: (typeof all)[0]) => (r.statuses as StatusRow)?.id ?? 1

  const revenue = all.reduce((sum, r) => sum + (r.budget_gbp ?? 0), 0)

  const stats = {
    total: all.length,
    new: all.filter((r) => statusOf(r) === 'New').length,
    inProgress: all.filter((r) => statusOf(r) === 'In Progress').length,
    completed: all.filter((r) => statusOf(r) === 'Completed').length,
    revenue,
  }

  const orders = all.map((r) => ({
    id: r.id,
    item_name: r.item_name,
    brand: r.brand,
    budget_gbp: r.budget_gbp,
    created_at: r.created_at,
    status_id: statusIdOf(r),
    status_name: statusOf(r),
    client_name: (r.profiles as ProfileRow)?.full_name ?? '—',
  }))

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ── Admin header bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: logo + label */}
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/admin" className="flex-shrink-0">
              <Image
                src="/logo-white.png"
                alt="The Shopper"
                width={120}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-brand-border flex-shrink-0" />
            <span className="hidden sm:block font-mono text-[10px] text-brand-gold uppercase tracking-[0.25em] whitespace-nowrap">
              Admin Panel
            </span>
          </div>

          {/* Right: sign out */}
          <form action={signOut}>
            <button
              type="submit"
              className="font-mono text-[10px] text-brand-muted hover:text-brand-text transition-colors uppercase tracking-widest min-h-[44px] flex items-center"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Hero strip: title + mascot ── */}
        <div className="flex items-center justify-between gap-6 py-10 border-b border-brand-border">
          <div>
            <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-2">
              Concierge View
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-brand-text uppercase leading-none">
              Request Queue
            </h1>
          </div>
          <div className="flex-shrink-0 animate-float hidden sm:block">
            <Image
              src="/mascot-admin.jpg"
              alt="The Shopper mascot"
              width={160}
              height={160}
              className="object-contain select-none"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-8">
          {[
            { label: 'Total Orders', value: stats.total, mono: false },
            { label: 'New', value: stats.new, mono: false },
            { label: 'In Progress', value: stats.inProgress, mono: false },
            { label: 'Completed', value: stats.completed, mono: false },
            {
              label: 'Total Revenue',
              value: `£${revenue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`,
              mono: true,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-brand-surface border border-brand-border p-4 min-w-0"
            >
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-2 leading-tight">
                {s.label}
              </p>
              <p
                className={
                  s.mono
                    ? 'font-mono text-2xl text-brand-gold font-bold'
                    : 'font-display text-4xl text-brand-text'
                }
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Orders table ── */}
        <div className="bg-brand-surface border border-brand-border mb-16">
          <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-text uppercase">All Orders</h2>
            <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          <AdminOrdersTable orders={orders} statuses={allStatuses} />
        </div>
      </main>
    </div>
  )
}
