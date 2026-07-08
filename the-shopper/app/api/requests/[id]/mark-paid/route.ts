import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: req } = await supabase
    .from('requests')
    .select('item_name, client_id')
    .eq('id', id)
    .single()

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('requests')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Confirm to the client — this must never break marking as paid
  try {
    const adminSupabase = createAdminClient()
    const { data: authData } = await adminSupabase.auth.admin.getUserById(req.client_id)
    const clientEmail = authData?.user?.email

    if (clientEmail) {
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
      await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: `Payment Received — ${req.item_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">Payment Received</h2>
            <p>Thank you — we've confirmed your payment for <strong>${req.item_name}</strong>. Your concierge will be in touch with next steps.</p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Client payment-confirmation email failed:', err)
  }

  return NextResponse.json({ success: true })
}
