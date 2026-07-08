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
    author_id: user.id,
    author_role: 'admin',
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
            <p style="margin:24px 0">
              <a href="https://theshopper.shop/login" style="display:inline-block;background:#c9a227;color:#111111;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:4px">Log In to View Your Request</a>
            </p>
            <p style="color:#666;font-size:13px">If the button doesn't work, visit https://theshopper.shop/login</p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Client note email failed:', err)
  }

  return NextResponse.json({ success: true })
}
