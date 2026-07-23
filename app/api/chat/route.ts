import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateDocument } from '@/lib/document-generator'
import { ALL_SERVICES, DEFAULT_TOKEN_BALANCE } from '@/lib/constants'


const MOCK_TOKEN_COST = 100

function getWebhookUrl(service?: string) {
  return process.env.N8N_TEXT_WEBHOOK_URL
}

export async function POST(req: Request) {
  try {
    console.log('🔥 CHAT API START')

    const body = await req.json()
    console.log('REQUEST BODY:', body)

    const {
  service,
  conversation_id,
  user_id,
  prompt,
  dataset,
} = body

    if (!user_id || !conversation_id || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const webhookUrl = getWebhookUrl(service)

    if (!webhookUrl) {
      console.error(`Missing webhook URL for service: ${service || 'text'}`)
      return NextResponse.json(
        { error: `No webhook configured for service: ${service || 'text'}` },
        { status: 500 }
      )
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('remaining_tokens, allowed_services, account_status')
      .eq('id', user_id)
      .single()

    const normalizedService = (service || 'text').toLowerCase()

    let remainingTokens = profile?.remaining_tokens ?? DEFAULT_TOKEN_BALANCE
    const allowedServices =
      Array.isArray(profile?.allowed_services) && profile?.allowed_services.length
        ? profile.allowed_services
        : ALL_SERVICES

    if (profileError?.code === 'PGRST116' || !profile) {
      console.log('Creating default profile for user:', user_id)

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id)

      const { error: createProfileError } = await supabaseAdmin.from('profiles').upsert(
        {
          id: user_id,
          full_name: authUser?.user?.user_metadata?.full_name || 'New User',
          email: authUser?.user?.email,
          role: 'user',
          daily_quota: 1000,
          remaining_tokens: DEFAULT_TOKEN_BALANCE,
          allowed_services: ALL_SERVICES,
          account_status: 'active',
          last_refresh: new Date(),
        },
        { onConflict: 'id' }
      )

      if (createProfileError) {
        console.error('PROFILE CREATE ERROR:', createProfileError)
        return NextResponse.json(
          { error: 'Unable to initialize user profile' },
          { status: 500 }
        )
      }

      remainingTokens = DEFAULT_TOKEN_BALANCE
    } else if (profileError) {
      console.error('PROFILE ERROR:', profileError)
      return NextResponse.json(
        { error: 'Unable to read profile' },
        { status: 500 }
      )
    }

    if (profile?.account_status && profile.account_status !== 'active') {
      return NextResponse.json(
        { error: 'Your account is not active' },
        { status: 403 }
      )
    }

    if (!allowedServices.includes(normalizedService)) {
      return NextResponse.json(
        { error: `You do not have access to the ${normalizedService} service` },
        { status: 403 }
      )
    }

    console.log('CURRENT TOKENS:', remainingTokens)

    if (remainingTokens < MOCK_TOKEN_COST) {
      return NextResponse.json(
        { error: 'Insufficient tokens' },
        { status: 400 }
      )
    }

    const { error: userMessageError } = await supabaseAdmin.from('messages').insert({
      conversation_id,
      role: 'user',
      content: prompt,
    })

    if (userMessageError) {
      console.error('USER MESSAGE ERROR:', userMessageError)
      throw userMessageError
    }

console.log('USER MESSAGE SAVED')
console.log('CALLING N8N...')
console.log('WEBHOOK URL:', webhookUrl)

let n8nResponse: Response

try {
  n8nResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
   body: JSON.stringify({
  service,
  conversation_id,
  user_id,
  prompt,
  dataset,
}),
  })
} catch (error) {
  console.error('FETCH ERROR:', error)

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : 'Unable to reach n8n',
    },
    { status: 502 }
  )
}

console.log('N8N STATUS:', n8nResponse.status)

const rawResponse = await n8nResponse.text()
console.log('N8N RAW RESPONSE:', rawResponse)

let aiData: any = null

try {
  aiData = JSON.parse(rawResponse)
} catch {
  aiData = rawResponse
}

console.log('N8N RESPONSE:', aiData)

if (!n8nResponse.ok) {
  const errorMessage =
    aiData?.error ||
    aiData?.message ||
    aiData?.detail ||
    aiData?.response?.error ||
    rawResponse ||
    'n8n webhook request failed'

  return NextResponse.json({ error: errorMessage }, { status: 502 })
}

const responseText =
  aiData?.response ||
  aiData?.message ||
  aiData?.output ||
  aiData?.result ||
  aiData?.data?.response ||
  aiData?.data?.message

    const newBalance = remainingTokens - MOCK_TOKEN_COST

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ remaining_tokens: newBalance })
      .eq('id', user_id)

    if (updateError) {
      console.error('TOKEN UPDATE ERROR:', updateError)
      throw updateError
    }

    console.log('TOKEN UPDATED:', newBalance)

    // Normalize image outputs for image service
    const imageUrls: string[] = []

    const collectImage = (item: any) => {
      if (!item) return
      if (typeof item === 'string') {
        if (item.startsWith('http') || item.startsWith('data:')) imageUrls.push(item)
        return
      }
      if (Array.isArray(item)) {
        for (const it of item) collectImage(it)
        return
      }
      if (typeof item.url === 'string') {
        imageUrls.push(item.url)
        return
      }
      if (typeof item.src === 'string') {
        imageUrls.push(item.src)
        return
      }
      if (typeof item.b64_json === 'string') {
        imageUrls.push(`data:image/png;base64,${item.b64_json}`)
        return
      }
    }

    if (service === 'image') {

  // Pollinations returns image_url
  if (typeof aiData?.image_url === 'string') {
    imageUrls.push(aiData.image_url)
  }

  // Other providers support
  collectImage(
    aiData?.data ||
    aiData?.images ||
    aiData?.output ||
    aiData?.response ||
    aiData?.result ||
    aiData?.image_urls
  )

  // fallback
  if (!imageUrls.length && typeof responseText === 'string') {
    const t = responseText.trim()

    if (t.startsWith('http') || t.startsWith('data:')) {
      imageUrls.push(t)
    }
  }

}


console.log("AI DATA:");
console.dir(aiData, { depth: null });

console.log("AI DATA PRESENTATION:");
console.dir(aiData.presentation, { depth: null });

let downloadUrl: string | null = null
let editUrl: string | null = null

if (service === 'presentation') {
  downloadUrl = aiData?.download_url || null
  editUrl = aiData?.edit_url || null
}





// Documents are generated locally
if (service === 'document') {
  try {
    downloadUrl = await generateDocument(
      responseText,
      prompt,
      user_id,
      conversation_id
    )

    console.log('DOCUMENT GENERATED:', downloadUrl)
  } catch (documentError) {
    console.error('DOCUMENT GENERATION ERROR:', documentError)
  }
}

    // Build assistant content
    const assistantContent =
  service === "image" && imageUrls.length > 0
    ? JSON.stringify({
        type: "image",
        urls: imageUrls,
      })
    : service === "document" && downloadUrl
    ? JSON.stringify({
        type: "document",
        url: downloadUrl,
        filename: `${prompt}.docx`,
      })
    : service === "presentation" && downloadUrl
    ? JSON.stringify({
        type: "presentation",
        url: downloadUrl,
        filename: `${prompt}.pptx`,
      })
    : typeof responseText === "string"
    ? responseText
    : JSON.stringify(responseText);

    const { error: assistantMessageError } = await supabaseAdmin.from('messages').insert({
      conversation_id,
      role: 'assistant',
      content: assistantContent,
    })

    if (assistantMessageError) {
      console.error('ASSISTANT MESSAGE ERROR:', assistantMessageError)
      throw assistantMessageError
    }

    console.log('ASSISTANT MESSAGE SAVED')

    // Return a response that includes image URLs or download URL when applicable
    console.log("SERVICE:", service)
console.log("AI DATA:", aiData)
console.log("DOWNLOAD URL:", downloadUrl)
    return NextResponse.json({
 response:
  service === 'document'
    ? 'Document generated successfully.'
    : service === 'presentation'
    ? 'Presentation generated successfully.'
    : service === 'image'
    ? 'Image generated successfully.'
    : responseText,

  downloadUrl,

  imageUrls:
    imageUrls.length > 0
      ? imageUrls
      : undefined,

  remaining_tokens: newBalance,
})
  } catch (error) {
    console.error('CHAT API ERROR:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Something went wrong',
      },
      { status: 500 }
    )
  }
}