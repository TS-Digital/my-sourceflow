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

  const body = await request.json()
  const quotedPrice = Number(body?.quoted_price)

  if (!quotedPrice || quotedPrice <= 0) {
    return NextResponse.json({ error: 'A valid quoted_price is required' }, { status: 400 })
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
    .update({
      quoted_price: quotedPrice,
      payment_status: 'unpaid',
      quoted_at: new Date().toISOString(),
      paid_at: null,
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Email the client with the quote + payment link — this must never break the quote itself
  try {
    const adminSupabase = createAdminClient()
    const { data: authData } = await adminSupabase.auth.admin.getUserById(req.client_id)
    const clientEmail = authData?.user?.email
    const shortId = id.slice(0, 8).toUpperCase()
    const paymentLink = process.env.PAYMENT_LINK

    if (clientEmail) {
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
      await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: `Payment Requested — ${req.item_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">Your Item Has Been Priced</h2>
            <p>Your request for <strong>${req.item_name}</strong> is ready for payment:</p>
            <p style="font-size:24px;font-weight:700;margin:16px 0">£${quotedPrice.toFixed(2)}</p>
            <p style="color:#666;font-size:13px;margin-bottom:20px">Reference: ${shortId}</p>
            ${
              paymentLink
                ? `<p style="margin:24px 0"><a href="${paymentLink}" style="display:inline-block;background:#c9a227;color:#111111;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:4px">Pay Now</a></p>
                   <p style="color:#666;font-size:13px">Please include reference <strong>${shortId}</strong> with your payment so we can match it to your order.</p>`
                : ''
            }
            <p style="margin:24px 0">
              <a href="https://theshopper.shop/login" style="color:#c9a227;font-weight:600">Log In to View Your Request</a>
            </p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Client quote email failed:', err)
  }

  return NextResponse.json({ success: true })
}
