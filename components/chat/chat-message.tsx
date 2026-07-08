import { MarkdownRenderer } from './markdown-renderer'

interface Props {
  role: 'user' | 'assistant' | 'system'
  message: string
}

export default function ChatMessage({
  role,
  message,
}: Props) {
  const isUser = role === 'user'

  let parsed: any = null
  try {
    parsed = JSON.parse(message)
  } catch (_) {
    parsed = null
  }

  const isDocument = parsed?.type === 'document' && parsed?.url
  const isImage = parsed?.type === 'image' && (Array.isArray(parsed?.urls) || typeof parsed?.url === 'string')

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >

      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 ${
          isUser ? 'bg-[#006A4E] text-white' : 'bg-slate-100 text-slate-900'
        }`}
      >

        {isDocument ? (
          <div className="flex items-center gap-3">
            <span>📄</span>
            <span className="font-medium">{parsed.filename || 'document.docx'}</span>
            <a
              href={parsed.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-3 underline ${isUser ? 'text-white/90' : 'text-sky-600'}`}
            >
              Download
            </a>
          </div>
        ) : isImage ? (
          <div className="flex flex-col gap-2">
            {(Array.isArray(parsed.urls) ? parsed.urls : [parsed.url]).map((u: string, idx: number) => (
              <a key={idx} href={u} target="_blank" rel="noopener noreferrer">
                <img src={u} alt={`image-${idx}`} className="max-w-full rounded-md" />
              </a>
            ))}
          </div>
        ) : (
          <MarkdownRenderer content={message} />
        )}

      </div>

    </div>
  )
}