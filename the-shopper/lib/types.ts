export type Role = 'client' | 'admin'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  role: Role
  created_at: string
}

export interface Status {
  id: number
  name: string
}

export interface Request {
  id: string
  client_id: string
  status_id: number
  item_name: string
  brand: string | null
  budget_gbp: number | null
  size: string | null
  colour: string | null
  notes: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

export interface RequestNote {
  id: string
  request_id: string
  admin_id: string
  note_text: string
  created_at: string
}

// Joined types returned from Supabase queries
export interface RequestRow extends Request {
  statuses: Status | null
  profiles: Profile | null
}

export interface NoteRow extends RequestNote {
  profiles: Pick<Profile, 'full_name'> | null
}
