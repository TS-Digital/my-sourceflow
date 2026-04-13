const STYLES: Record<string, string> = {
  New: 'bg-blue-950/60 text-blue-400 border border-blue-900/60',
  'In Progress': 'bg-amber-950/60 text-amber-400 border border-amber-900/60',
  Sourced: 'bg-purple-950/60 text-purple-400 border border-purple-900/60',
  Completed: 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60',
}

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] ?? 'bg-zinc-900 text-zinc-400 border border-zinc-800'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase ${cls}`}
    >
      {status}
    </span>
  )
}
