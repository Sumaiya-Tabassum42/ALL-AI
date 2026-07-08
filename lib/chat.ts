import { supabase } from './supabase'

export interface Conversation {
  id: string
  user_id: string
  service: string
  title: string
  created_at: string
  updated_at: string
}

function requireService(service: string) {
  if (!service) {
    throw new Error('Service is required to load or create conversations.')
  }
}

export async function createConversation(service: string) {
  requireService(service)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: user.id,
      service,
      title: 'New Chat',
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create conversation.')
  }

  return data as Conversation
}

export async function getConversations(service: string) {
  if (!service) {
    return []
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const response = await fetch(
    `/api/conversations?user_id=${encodeURIComponent(user.id)}&service=${encodeURIComponent(service)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Unable to load conversations.')
  }

  return data as Conversation[]
}
