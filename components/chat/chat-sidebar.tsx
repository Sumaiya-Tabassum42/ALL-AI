'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Home, MessageSquare, Plus } from 'lucide-react'

import {
  createConversation,
  getConversations,
  type Conversation,
} from '@/lib/chat'

interface Props {
  service?: string
  title: string
  selectedChat: string | null
}

export default function ChatSidebar({
  service: propService,
  title,
  selectedChat,
}: Props) {
  const router = useRouter()
  const params = useParams<{ services?: string }>()
  const pathname = usePathname()
  const pathService = pathname?.split('/')?.[2] ?? ''
  const service = propService || params.services || pathService || ''

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  async function loadConversations() {
    try {
      const data = await getConversations(service)
      setConversations(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [service])

  async function handleNewChat() {
    if (!service) {
      alert('Unable to create a new conversation. Service is missing.')
      return
    }

    try {
      const conversation = await createConversation(service)

      setConversations((prev) => [conversation, ...prev])

      router.push(`/workspace/${encodeURIComponent(service)}?chat=${conversation.id}`)
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to create a new conversation.'
      )
    }
  }

  function openConversation(chatId: string) {
    if (!service) {
      return
    }

    router.push(`/workspace/${encodeURIComponent(service)}?chat=${chatId}`)
  }

  console.log('SERVICE:', service)
  console.log('SERVICE IN SIDEBAR:', service)

  return (
    <aside className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">

      <div className="border-b border-slate-200 p-5">

        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {title}
        </h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Home size={18} />
            Home
          </button>

          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006A4E] py-3 font-medium text-white transition hover:bg-[#00543E]"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-3">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Chats
        </p>

        {loading && (
          <p className="px-3 text-sm text-slate-500">
            Loading...
          </p>
        )}

        {!loading && conversations.length === 0 && (
          <p className="px-3 text-sm text-slate-500">
            No conversations yet.
          </p>
        )}

        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => openConversation(chat.id)}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
              selectedChat === chat.id
                ? 'bg-[#E8F3EF] text-[#006A4E]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare size={18} />

            <span className="truncate">
              {chat.title}
            </span>
          </button>
        ))}

      </div>

    </aside>
  )
}