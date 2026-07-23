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

  // ✅ Put it HERE
  const [dataset, setDataset] = useState<any[]>([])

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

  const welcomeMessage =
    service === 'data_analysis'
      ? 'Welcome to AI Data Analysis.\n\nCreate a New Chat, upload an Excel or CSV file using the 📎 button, then ask anything about your dataset.'
      : `Welcome to ${title}. Click "New Chat" to get started.`

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

      {service === 'data_analysis' && dataset.length > 0 && (
  <div className="border-b border-slate-200 bg-white px-8 py-4">
  <div className="mx-auto max-w-6xl overflow-auto rounded-xl border border-slate-200 bg-white">

    <table className="min-w-full border-collapse text-sm text-slate-900">

      <thead className="bg-slate-100">
        <tr>
          {Object.keys(dataset[0]).map((key) => (
            <th
              key={key}
              className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-900"
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {dataset.slice(0, 20).map((row, i) => (
          <tr key={i} className="even:bg-slate-50">
            {Object.values(row).map((value, j) => (
              <td
                key={j}
                className="border border-slate-200 px-3 py-2 text-slate-700"
              >
                {String(value ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

    </table>

  </div>
</div>
)}

      <div className="flex-1 overflow-y-auto px-8 py-8">

        <div className="mx-auto flex max-w-4xl flex-col gap-5">

          {!chatId && (
            <ChatMessage
              role="assistant"
              message={welcomeMessage}
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
  dataset={dataset}
  setDataset={setDataset}
/>

    </div>
  )
}