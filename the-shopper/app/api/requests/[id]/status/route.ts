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

  // Look up the client's email via service role (auth.users is not accessible via anon key)
  const adminSupabase = createAdminClient()
  const { data: authData } = await adminSupabase.auth.admin.getUserById(req.client_id)
  const clientEmail = authData?.user?.email

  if (clientEmail) {
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    resend.emails
      .send({
        from: fromEmail,
        to: clientEmail,
        subject: `Your Request Has Been Updated — ${req.item_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="margin-bottom:16px">Your Request Has Been Updated</h2>
            <p>Your sourcing request for <strong>${req.item_name}</strong> has a new status:</p>
            <p style="font-size:18px;font-weight:600;margin:16px 0">${newStatusName}</p>
            <p style="color:#666">Log in to view the full details of your request.</p>
          </div>
        `,
      })
      .catch((err: unknown) => console.error('Client status email failed:', err))
  }

  return NextResponse.json({ success: true })
}
