import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import NewRequestForm from '@/components/NewRequestForm'

export default async function NewRequestPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1.5">
            Concierge Service
          </p>
          <h1 className="font-display text-3xl text-brand-text">New Shopping Request</h1>
          <p className="text-sm text-brand-muted mt-2">
            Describe the item you&apos;re looking for. Our team will source it for you.
          </p>
        </div>
        <NewRequestForm />
      </main>
    </>
  )
}
