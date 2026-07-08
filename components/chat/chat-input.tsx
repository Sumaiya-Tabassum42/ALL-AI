'use client'

import { Send, Paperclip } from 'lucide-react'
import { useState } from 'react'

import { supabase } from '@/lib/supabase'

interface Props {
  chatId: string | null
  service: string
  onMessageSent: () => void
}

export default function ChatInput({
  chatId,
  service,
  onMessageSent,
}: Props) {
  const [prompt, setPrompt] = useState('')
  const [sending, setSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function handleSend() {
    const message = prompt.trim()

    if (!chatId) {
      alert('Please create a new chat first.')
      return
    }

    if (!message || sending) return

    try {
      setSending(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not logged in')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          conversation_id: chatId,
          user_id: user.id,
          prompt: message,
        }),
      })

      const data = await response.json()

      console.log('CHAT RESPONSE:', data)

      if (data.downloadUrl) {
        window.open(data.downloadUrl)
      }

      if (!response.ok) {
        console.log('API ERROR:', data)
        throw new Error(data.error || 'AI request failed')
      }

      if (!data?.response) {
        throw new Error('No AI response received')
      }

      setPrompt('')
      setSelectedFile(null)
      onMessageSent()
    } catch (error) {
      console.error(error)
      alert('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white p-6">

      <div className="mx-auto max-w-4xl">

        {/* Selected File */}
        {selectedFile && (
          <div className="mb-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
            📎 {selectedFile.name}
          </div>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 shadow-sm">

          {/* Hidden File Input */}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setSelectedFile(file)
              }
            }}
          />

          {/* Upload Button */}
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#006A4E]"
          >
            <Paperclip size={20} />
          </label>

          {/* Prompt Input */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder={
              service === 'image'
                ? 'Describe the image you want to generate...'
                : service === 'document'
                ? 'Describe the document you want...'
                : service === 'data_analysis'
                ? 'Ask about your data or upload an Excel file...'
                : 'Ask anything...'
            }
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="rounded-lg bg-[#006A4E] p-3 text-white transition hover:bg-[#00543E] disabled:opacity-50"
          >
            <Send size={18} />
          </button>

        </div>

      </div>

    </div>
  )
}