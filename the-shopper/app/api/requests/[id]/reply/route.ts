import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

  const body = await request.json()
  const noteText = (body?.note_text as string | undefined)?.trim()

  if (!noteText) {
    return NextResponse.json({ error: 'note_text is required' }, { status: 400 })
  }

  const { data: req } = await supabase
    .from('requests')
    .select('item_name, client_id')
    .eq('id', id)
    .single()

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  if (req.client_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { error: insertError } = await supabase.from('request_notes').insert({
    request_id: id,
    author_id: user.id,
    author_role: 'client',
    note_text: noteText,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Notify the business of the client's reply — this must never break reply creation
  try {
    const clientName = profile?.full_name ?? user.email ?? 'A client'
    await resend.emails.send({
      from: 'The Shopper <onboarding@resend.dev>',
      to: 'tstheshopper@outlook.com',
      subject: `Client Reply — ${req.item_name} from ${clientName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="margin-bottom:16px">New Client Reply</h2>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Item:</strong> ${req.item_name}</p>
          <p style="font-size:16px;margin:16px 0;padding:16px;background:#f5f5f5;border-left:3px solid #c9a227;color:#111">${noteText}</p>
          <br/>
          <a href="https://theshopper.shop/admin">View in Admin Panel</a>
        </div>
      `,
    })
  } catch (err) {
    console.error('Admin reply-notification email failed:', err)
  }

  return NextResponse.json({ success: true })
}
