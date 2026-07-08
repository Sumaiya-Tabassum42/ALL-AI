import { Suspense } from 'react'
import ChatLayout from '@/components/chat/chat-layout'

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatLayout
        service="text"
        title="Text Service"
      />
    </Suspense>
  )
}