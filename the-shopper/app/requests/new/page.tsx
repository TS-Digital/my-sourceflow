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
      <main className="pt-16 max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-3">
            Concierge Service
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-text uppercase">
            New Request
          </h1>
          <p className="font-sans text-sm text-brand-muted mt-3 leading-relaxed">
            Describe the item you&apos;re looking for. Our team will source it for you.
          </p>
        </div>
        <NewRequestForm />
      </main>
    </>
  )
}
