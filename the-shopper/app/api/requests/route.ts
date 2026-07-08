import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { item_name, brand, budget_gbp, size, colour, notes, phone_number } = body

  if (!item_name?.trim()) {
    return NextResponse.json({ error: 'item_name is required' }, { status: 400 })
  }

  const { data: inserted, error: insertError } = await supabase
    .from('requests')
    .insert({
      client_id: user.id,
      status_id: 1,
      item_name: item_name.trim(),
      brand: brand || null,
      budget_gbp: budget_gbp != null ? Number(budget_gbp) : null,
      size: size || null,
      colour: colour || null,
      notes: notes || null,
      phone_number: phone_number || null,
    })
    .select('id')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Get client's name for the email
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const clientName = profile?.full_name ?? user.email ?? 'Unknown'
  const budget = budget_gbp != null ? `£${budget_gbp}` : 'Not specified'

  // Notify the business — this must never break request submission
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    await resend.emails.send({
      from: fromEmail,
      to: 'tstheshopper@outlook.com',
      subject: `New Request — ${item_name} from ${clientName}`,
      html: `
        <h2>New Request Received</h2>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Item:</strong> ${item_name}</p>
        <p><strong>Brand:</strong> ${brand || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
        <br/>
        <a href="https://theshopper.shop/admin">View in Admin Panel</a>
      `,
    })
  } catch (err) {
    console.error('New-request admin notification email failed:', err)
  }

  return NextResponse.json({ success: true, id: inserted?.id })
}
