import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ALL_SERVICES, DEFAULT_TOKEN_BALANCE } from '@/lib/constants'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const user_id = url.searchParams.get('user_id')

  if (!user_id) {
    return NextResponse.json(
      { error: 'Missing user_id' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user_id)
    .single()

  if (error) {
    console.error('PROFILE GET ERROR:', error)
    return NextResponse.json(
      { error: 'Unable to load profile' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      user_id,
      email,
      full_name,
      department,
      token_limit,
      allowed_services,
      account_status,
    } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const initialTokens =
      typeof token_limit === 'number' && token_limit > 0
        ? token_limit
        : DEFAULT_TOKEN_BALANCE

    const services =
      Array.isArray(allowed_services) && allowed_services.length
        ? allowed_services
        : ALL_SERVICES

    const { error } = await supabaseAdmin.from('profiles').upsert(
      {
        id: user_id,
        email,
        full_name,
        department,
        role: 'user',
        remaining_tokens: initialTokens,
        allowed_services: services,
        account_status: account_status || 'active',
        last_refresh: new Date(),
      },
      {
        onConflict: 'id',
      }
    )

    if (error) {
      console.error('PROFILE INIT ERROR:', error)
      return NextResponse.json(
        { error: 'Unable to initialize profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PROFILE API ERROR:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong',
      },
      {
        status: 500,
      }
    )
  }
}
