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

  // Send notification to admin — fire and forget, don't block the response
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const rows = [
    ['Client', profile?.full_name ?? user.email],
    ['Phone', phone_number || '—'],
    ['Item', item_name],
    ['Brand', brand || '—'],
    ['Budget', budget_gbp != null ? `£${budget_gbp}` : '—'],
    ['Size', size || '—'],
    ['Colour', colour || '—'],
    ['Notes', notes || '—'],
  ]

  resend.emails
    .send({
      from: fromEmail,
      to: 'tstheshopper@outlook.com',
      subject: `New Request: ${item_name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="margin-bottom:24px">New Sourcing Request</h2>
          <table style="width:100%;border-collapse:collapse">
            ${rows
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:120px;border:1px solid #e0e0e0">${label}</td>
                <td style="padding:8px 12px;border:1px solid #e0e0e0">${value}</td>
              </tr>`,
              )
              .join('')}
          </table>
          ${appUrl ? `<p style="margin-top:24px"><a href="${appUrl}/admin/${inserted.id}">View Request →</a></p>` : ''}
        </div>
      `,
    })
    .catch((err: unknown) => console.error('Admin email failed:', err))

  return NextResponse.json({ success: true })
}
