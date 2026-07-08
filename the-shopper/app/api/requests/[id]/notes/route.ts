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

  // Verify caller is an admin
  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const noteText = (body?.note_text as string | undefined)?.trim()

  if (!noteText) {
    return NextResponse.json({ error: 'note_text is required' }, { status: 400 })
  }

  // Fetch request details so we have item_name + client_id for the email
  const { data: req } = await supabase
    .from('requests')
    .select('item_name, client_id')
    .eq('id', id)
    .single()

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  const { error: insertError } = await supabase.from('request_notes').insert({
    request_id: id,
    admin_id: user.id,
    note_text: noteText,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Email the client about the new note — this must never break note creation
  try {
    const adminSupabase = createAdminClient()
    const { data: authData } = await adminSupabase.auth.admin.getUserById(req.client_id)
    const clientEmail = authData?.user?.email

    if (clientEmail) {
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
      await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: `New Update on Your Request — ${req.item_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">New Update on Your Request</h2>
            <p>Your concierge added a new note on your request for <strong>${req.item_name}</strong>:</p>
            <p style="font-size:16px;margin:16px 0;padding:16px;background:#f5f5f5;border-left:3px solid #c9a227;color:#111">${noteText}</p>
            <p style="color:#666">Log in to view the full details of your request.</p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Client note email failed:', err)
  }

  return NextResponse.json({ success: true })
}
