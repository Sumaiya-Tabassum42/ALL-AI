'use client'

import { useParams, useSearchParams, usePathname } from 'next/navigation'

import ChatSidebar from './chat-sidebar'
import ChatWindow from './chat-window'

interface ChatLayoutProps {
  service?: string
  title: string
}

export default function ChatLayout({
  service: propService,
  title,
}: ChatLayoutProps) {
  const searchParams = useSearchParams()
  const params = useParams<{ services?: string }>()
  const pathname = usePathname()
  const pathService = pathname?.split('/')?.[2] ?? ''
  const service = propService || params.services || pathService || 'text'

  const selectedChat = searchParams.get('chat')
  console.log('SERVICE IN LAYOUT:', service)

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar
        service={service}
        title={title}
        selectedChat={selectedChat}
      />

      <ChatWindow
        service={service}
        title={title}
        chatId={selectedChat}
      />
    </div>
  )
}