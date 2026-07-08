'use client'

import { useCallback, useEffect, useState } from 'react'

import ChatInput from './chat-input'
import ChatMessage from './chat-message'

import {
  getMessages,
  type Message,
} from '@/lib/messages'

interface Props {
  service: string
  title: string
  chatId: string | null
}

export default function ChatWindow({
  service,
  title,
  chatId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const loadMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([])
      return
    }

    try {
      setLoading(true)

      const data = await getMessages(chatId)

      setMessages(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [chatId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return (
    <div className="flex flex-1 flex-col">

      {/* Header */}

      <div className="border-b border-slate-200 bg-white px-8 py-5">

        <h1 className="text-2xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Service: {service}
        </p>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto px-8 py-8">

        <div className="mx-auto flex max-w-4xl flex-col gap-5">

          {!chatId && (
            <ChatMessage
              role="assistant"
              message={`Welcome to ${title}. Click "New Chat" to get started.`}
            />
          )}

          {loading && (
            <p className="text-sm text-slate-500">
              Loading messages...
            </p>
          )}

          {!loading &&
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                message={message.content}
              />
            ))}

        </div>

      </div>

      <ChatInput
  chatId={chatId}
  service={service}
  onMessageSent={loadMessages}
/>

    </div>
  )
}