import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversation_id')

  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('generation_status')
    .select('status_text, updated_at')
    .eq('conversation_id', conversationId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ status_text: null })
  }

  return NextResponse.json(data)
}