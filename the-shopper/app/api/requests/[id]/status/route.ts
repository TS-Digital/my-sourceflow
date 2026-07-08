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
  const { status_id } = body

  if (!status_id) {
    return NextResponse.json({ error: 'status_id is required' }, { status: 400 })
  }

  // Fetch request details before updating so we have item_name + client_id
  const { data: req } = await supabase
    .from('requests')
    .select('item_name, client_id')
    .eq('id', id)
    .single()

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  // Update the status
  const { error: updateError } = await supabase
    .from('requests')
    .update({ status_id })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Fetch the new status name
  const { data: statusRow } = await supabase
    .from('statuses')
    .select('name')
    .eq('id', status_id)
    .single()

  const newStatusName = statusRow?.name ?? 'Updated'

  // Email the client — this must never break the status update itself
  try {
    const adminSupabase = createAdminClient()
    const { data: authData } = await adminSupabase.auth.admin.getUserById(req.client_id)
    const clientEmail = authData?.user?.email

    if (clientEmail) {
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
      await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: `Your Request Has Been Updated — ${req.item_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">Your Request Has Been Updated</h2>
            <p>Your sourcing request for <strong>${req.item_name}</strong> has a new status:</p>
            <p style="font-size:18px;font-weight:600;margin:16px 0">${newStatusName}</p>
            <p style="margin:24px 0">
              <a href="https://theshopper.shop/login" style="display:inline-block;background:#c9a227;color:#111111;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:4px">Log In to View Your Request</a>
            </p>
            <p style="color:#666;font-size:13px">If the button doesn't work, visit https://theshopper.shop/login</p>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Client status email failed:', err)
  }

  return NextResponse.json({ success: true })
}
