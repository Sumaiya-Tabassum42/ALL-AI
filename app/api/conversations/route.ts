import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const user_id = url.searchParams.get('user_id')
  const service = url.searchParams.get('service')

  if (!user_id || !service) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 }
    )
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('allowed_services, account_status')
    .eq('id', user_id)
    .single()

  if (profileError) {
    console.error('PROFILE FETCH ERROR:', profileError)
    return NextResponse.json(
      { error: 'Unable to load user profile' },
      { status: 500 }
    )
  }

  if (profile?.account_status && profile.account_status !== 'active') {
    return NextResponse.json(
      { error: 'Account is not active' },
      { status: 403 }
    )
  }

  const allowedServices =
    Array.isArray(profile?.allowed_services) && profile?.allowed_services.length
      ? profile.allowed_services
      : []

  if (allowedServices.length > 0 && !allowedServices.includes(service)) {
    return NextResponse.json(
      { error: `You do not have access to the ${service} service` },
      { status: 403 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('user_id', user_id)
    .eq('service', service)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('CONVERSATION LIST ERROR:', error)
    return NextResponse.json(
      { error: 'Unable to load conversations' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, service, title = 'New Chat' } = body

    if (!user_id || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('allowed_services, account_status')
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('PROFILE FETCH ERROR:', profileError)
      return NextResponse.json(
        { error: 'Unable to load user profile' },
        { status: 500 }
      )
    }

    if (profile?.account_status && profile.account_status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      )
    }

    const allowedServices =
      Array.isArray(profile?.allowed_services) && profile?.allowed_services.length
        ? profile.allowed_services
        : []

    if (allowedServices.length > 0 && !allowedServices.includes(service)) {
      return NextResponse.json(
        { error: `You do not have access to the ${service} service` },
        { status: 403 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert({
        user_id,
        service,
        title,
      })
      .select()
      .single()

    if (error) {
      console.error('CREATE CONVERSATION ERROR:', error)
      return NextResponse.json(
        { error: 'Unable to create conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('CONVERSATION API ERROR:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to create conversation',
      },
      { status: 500 }
    )
  }
}
